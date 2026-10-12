// Path: src/app/admin/penduduk/actions.ts
// Dibuat baru - Server Action untuk memproses file Excel/CSV di sisi server

"use server";

import { createAdminClient } from "../../../utils/supabase/admin";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";
import { z } from "zod";

// Skema validasi per baris (mirip form, tapi toleran terhadap tipe data awal dari Excel)
const importRowSchema = z.object({
  nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  no_kk: z.string().regex(/^\d{16}$/, "KK harus 16 digit angka"),
  nama_lengkap: z.string().min(3, "Nama kosong/terlalu pendek"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
  tempat_lahir: z.string().min(1, "Tempat lahir kosong"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir kosong"),
  agama: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Kepercayaan Lainnya"]),
  pendidikan: z.string().min(1, "Pendidikan kosong"),
  pekerjaan: z.string().min(1, "Pekerjaan kosong"),
  golongan_darah: z.string().default("-"),
  status_perkawinan: z.enum(["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"]),
  hubungan_keluarga: z.string().min(1, "Hubungan keluarga kosong"),
  rt: z.string(),
  rw: z.string(),
  alamat_lengkap: z.string().optional().default(""),
  status_penduduk: z.enum(["Tetap", "Pindah", "Meninggal"]).default("Tetap"),
});

export async function importDataPenduduk(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      return { success: false, message: "File tidak ditemukan atau kosong." };
    }

    // 1. Baca file menjadi Buffer di Server
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parsing file menggunakan SheetJS
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Konversi ke JSON (raw: false agar format tanggal Excel otomatis jadi string)
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false }) as any[];

    if (rawData.length === 0) return { success: false, message: "Dokumen Excel/CSV kosong." };
    if (rawData.length > 2000) return { success: false, message: "Maksimal 2.000 baris per import untuk menjaga performa." };

    const supabaseAdmin = createAdminClient();
    
    // 3. Ambil semua NIK yang sudah ada di database untuk mengecek duplikat secara massal
    const { data: existingData } = await supabaseAdmin.from("penduduk").select("nik");
    const existingNiks = new Set(existingData?.map((row) => row.nik) || []);

    const validRows: any[] = [];
    const errorReports: string[] = [];
    let successCount = 0;

    // 4. Validasi per baris
    rawData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 karena index 0 dan baris 1 adalah Header Excel

      try {
        // Normalisasi data dari Excel (mengubah angka/spasi berlebih menjadi string bersih)
        const sanitizedRow = {
          ...row,
          nik: String(row.nik).trim(),
          no_kk: String(row.no_kk).trim(),
          rt: String(row.rt).padStart(2, '0'), // Excel kadang mengubah '01' jadi '1'
          rw: String(row.rw).padStart(2, '0'),
          // Format tanggal Excel harus disesuaikan ke standar YYYY-MM-DD jika memungkinkan
          // Asumsi template mewajibkan format text YYYY-MM-DD
          tanggal_lahir: String(row.tanggal_lahir).trim(), 
        };

        // Cek duplikasi NIK
        if (existingNiks.has(sanitizedRow.nik)) {
          errorReports.push(`Baris ${rowNumber}: NIK ${sanitizedRow.nik} sudah terdaftar.`);
          return; // Lanjut ke baris berikutnya
        }

        // Cek duplikasi NIK di dalam file yang sama
        if (validRows.some(r => r.nik === sanitizedRow.nik)) {
          errorReports.push(`Baris ${rowNumber}: NIK ${sanitizedRow.nik} ganda di dalam file Excel.`);
          return;
        }

        // Validasi Zod
        const validated = importRowSchema.parse(sanitizedRow);
        validRows.push(validated);

      } catch (err: any) {
        if (err instanceof z.ZodError) {
          const firstError = err.issues[0].message;
          errorReports.push(`Baris ${rowNumber}: ${firstError}`);
        } else {
          errorReports.push(`Baris ${rowNumber}: Format data tidak valid.`);
        }
      }
    });

    // 5. Pemrosesan per Chunk (Batch Insert)
    // Supabase merekomendasikan insert per 500-1000 baris agar tidak timeout
    const chunkSize = 500;
    for (let i = 0; i < validRows.length; i += chunkSize) {
      const chunk = validRows.slice(i, i + chunkSize);
      const { error: insertError } = await supabaseAdmin.from("penduduk").insert(chunk);
      
      if (insertError) {
        throw new Error(`Gagal menyimpan chunk ${i/chunkSize + 1}: ${insertError.message}`);
      }
      successCount += chunk.length;
    }

    revalidatePath("/admin/penduduk");

    return {
      success: true,
      report: {
        total: rawData.length,
        successCount,
        failedCount: errorReports.length,
        errors: errorReports.slice(0, 10), // Hanya kembalikan 10 error pertama agar UI tidak penuh
      }
    };

  } catch (error: any) {
    return { success: false, message: "Terjadi kesalahan server: " + error.message };
  }
}