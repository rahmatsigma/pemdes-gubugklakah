"use server";

import { createAdminClient } from "../../utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitPengaduan(formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const kontak = formData.get("kontak") as string;
    const kategori = formData.get("kategori") as string;
    const judul = formData.get("judul") as string;
    const isi = formData.get("isi") as string;
    const file = formData.get("lampiran") as File | null;

    if (!kategori || !judul || !isi) {
      return { error: "Kategori, judul, dan isi laporan wajib diisi." };
    }

    const supabaseAdmin = createAdminClient();

    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tiket = `ADU-${year}-${randomChars}`;

    let filePath = null;

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) return { error: "Ukuran lampiran maksimal 5MB." };
      
      const fileExt = file.name.split('.').pop();
      const safeFileName = `pengaduan/${tiket}-${Date.now()}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabaseAdmin.storage
        .from("berkas_syarat")
        .upload(safeFileName, file);

      if (storageError) throw new Error("Gagal mengunggah lampiran: " + storageError.message);
      filePath = storageData.path;
    }

    const { error: dbError } = await supabaseAdmin.from("pengaduan").insert([
      {
        tiket,
        nama_pelapor: nama ? nama.trim() : "Anonim",
        kontak: kontak ? kontak.trim() : null,
        kategori,
        judul,
        isi,
        file_lampiran_url: filePath,
      }
    ]);

    if (dbError) throw new Error("Gagal menyimpan laporan: " + dbError.message);

    return { success: true, tiket };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan sistem saat mengirim laporan." };
  }
}

// ==========================================
// FUNGSI BARU UNTUK ADMIN (UPDATE PENGADUAN)
// ==========================================
export async function updatePengaduanAdmin(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const tanggapan = formData.get("tanggapan") as string;
    const isPublic = formData.get("is_public") === "true";

    if (!id || !status) {
      return { error: "Data tidak lengkap untuk pembaruan." };
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("pengaduan")
      .update({
        status: status,
        tanggapan_admin: tanggapan || null,
        is_public: isPublic,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/pengaduan");
    revalidatePath(`/admin/pengaduan/${id}`);
    revalidatePath("/"); // Update beranda jika dipublish

    return { success: true };
  } catch (error: any) {
    return { error: "Gagal memperbarui pengaduan: " + error.message };
  }
}