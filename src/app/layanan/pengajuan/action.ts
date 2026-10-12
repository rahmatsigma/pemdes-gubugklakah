// Path: src/app/layanan/pengajuan/actions.ts
// Dibuat baru

"use server";

import { createAdminClient } from "../../../utils/supabase/admin";

export async function submitPermohonan(formData: FormData) {
  try {
    // 1. Ambil data dari form
    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    const kontak = formData.get("kontak") as string;
    const keperluan = formData.get("keperluan") as string;
    const jenisSuratId = formData.get("jenis_surat_id") as string;
    const file = formData.get("berkas") as File;

    // 2. Validasi Server Dasar
    if (!nik || nik.length !== 16) return { error: "NIK harus terdiri dari 16 digit angka." };
    if (!nama || !kontak || !keperluan || !jenisSuratId) return { error: "Semua kolom teks wajib diisi." };
    if (!file || file.size === 0) return { error: "Berkas persyaratan wajib diunggah." };
    if (file.size > 2 * 1024 * 1024) return { error: "Ukuran file maksimal 2MB." };

    const supabaseAdmin = createAdminClient();

    // 3. Generate Kode Tiket Unik (Format: GBK-2026-XXXXX)
    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tiket = `GBK-${year}-${randomChars}`;

    // 4. Upload File ke Bucket PRIVATE
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${tiket}-${Date.now()}.${fileExt}`;
    
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from("berkas_syarat")
      .upload(safeFileName, file);

    if (storageError) throw new Error("Gagal mengunggah berkas: " + storageError.message);

    // CATATAN KEAMANAN: Kita menyimpan 'path' file-nya, bukan Public URL. 
    // Karena bucket ini private, Public URL tidak akan berfungsi. 
    // Nanti admin butuh "Signed URL" untuk melihatnya.
    const filePath = storageData.path;

    // 5. Simpan Data ke Tabel Permohonan
    const { error: dbError } = await supabaseAdmin.from("permohonan_surat").insert([
      {
        tiket,
        nik,
        nama,
        kontak,
        keperluan,
        jenis_surat_id: jenisSuratId,
        file_syarat_url: filePath,
      }
    ]);

    if (dbError) throw new Error("Gagal menyimpan data pengajuan: " + dbError.message);

    // 6. Kembalikan kode tiket agar bisa ditampilkan ke warga
    return { success: true, tiket };

  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}