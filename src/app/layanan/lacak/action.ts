"use server";

import { createAdminClient } from "../../../utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function cekStatusSurat(formData: FormData) {
  try {
    const tiket = formData.get("tiket") as string;
    const verifikasi = formData.get("verifikasi") as string;

    if (!tiket || !verifikasi) {
      return { error: "Kode tiket dan data verifikasi wajib diisi." };
    }

    const supabaseAdmin = createAdminClient();

    // Cari data permohonan berdasarkan tiket
    const { data, error } = await supabaseAdmin
      .from("permohonan_surat")
      .select(`
        tiket, 
        nik, 
        kontak, 
        nama, 
        status, 
        catatan_admin, 
        created_at, 
        updated_at,
        jenis_surat:jenis_surat_id (nama)
      `)
      .eq("tiket", tiket.trim().toUpperCase())
      .single();

    if (error || !data) {
      return { error: "Tiket tidak ditemukan. Periksa kembali penulisan kode tiket Anda." };
    }

    // Konversi tipe 'data' menjadi 'any' agar TypeScript tidak protes
    const safeData = data as any;

    // VERIFIKASI KEAMANAN
    const empatDigitTerakhirNik = safeData.nik.slice(-4);
    if (verifikasi.trim() !== empatDigitTerakhirNik && verifikasi.trim() !== safeData.kontak) {
      return { error: "Data verifikasi tidak cocok. Pastikan Anda memasukkan 4 digit terakhir NIK atau nomor WhatsApp yang benar." };
    }

    // DATA MASKING
    const namaDisamarkan = safeData.nama.substring(0, 3) + "*".repeat(safeData.nama.length - 3);

    // Ambil nama surat dengan aman
    const namaSurat = Array.isArray(safeData.jenis_surat) 
      ? safeData.jenis_surat[0]?.nama 
      : safeData.jenis_surat?.nama;

    return {
      success: true,
      data: {
        tiket: safeData.tiket,
        nama: namaDisamarkan,
        jenis_surat: namaSurat || "Surat Keterangan Desa",
        status: safeData.status,
        catatan: safeData.catatan_admin,
        tanggal_pengajuan: safeData.created_at,
        tanggal_update: safeData.updated_at
      }
    };

  } catch (error: any) {
    return { error: "Terjadi kesalahan server saat melacak surat." };
  }
}

// ==========================================
// FUNGSI BARU UNTUK ADMIN (UPDATE STATUS)
// ==========================================
export async function updateStatusSurat(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const catatan = formData.get("catatan") as string;

    if (!id || !status) {
      return { error: "Data tidak lengkap untuk pembaruan status." };
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("permohonan_surat")
      .update({
        status: status,
        catatan_admin: catatan || null, // Kosongkan jika tidak ada catatan
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;

    // Bersihkan cache Next.js agar halaman admin langsung ter-update
    revalidatePath("/admin/surat");
    revalidatePath(`/admin/surat/${id}`);

    return { success: true };
  } catch (error: any) {
    return { error: "Gagal memperbarui status: " + error.message };
  }
}