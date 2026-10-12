// Path: src/app/admin/pengaduan/[id]/page.tsx
// Edit (Memisahkan tombol Lihat dan Unduh untuk Lampiran)

import { createClient } from "../../../../utils/supabase/server";
import { createAdminClient } from "../../../../utils/supabase/admin";
import Link from "next/link";
import { ArrowLeft, User, MessageSquare, Phone, Calendar, Eye, Globe, Download } from "lucide-react";
import Badge from "../../../../components/ui/badge";
import FormTanggapanPengaduan from "./FormTanggapanPengaduan";

export default async function DetailPengaduanAdmin(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const { data: pengaduan, error } = await supabase
    .from("pengaduan")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pengaduan) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-500 mb-4">Data pengaduan tidak ditemukan.</p>
        <Link href="/admin/pengaduan" className="text-primary-600 font-bold hover:underline">
          &larr; Kembali ke Daftar
        </Link>
      </div>
    );
  }

  // GENERATE SIGNED URL SEMENTARA
  let fileLampiranUrl = "";
  let fileLampiranDownloadUrl = "";

  if (pengaduan.file_lampiran_url) {
    // 1. URL untuk PREVIEW (Buka di tab baru)
    const { data: urlData } = await supabaseAdmin.storage
      .from("berkas_syarat")
      .createSignedUrl(pengaduan.file_lampiran_url, 600); 
      
    if (urlData) {
      fileLampiranUrl = urlData.signedUrl;
    }

    // 2. URL untuk FORCE DOWNLOAD (Langsung simpan)
    const { data: downloadData } = await supabaseAdmin.storage
      .from("berkas_syarat")
      .createSignedUrl(pengaduan.file_lampiran_url, 600, { download: true }); 
      
    if (downloadData) {
      fileLampiranDownloadUrl = downloadData.signedUrl;
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai": return "success";
      case "Ditolak": return "danger";
      case "Ditindaklanjuti": return "warning";
      default: return "info";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pengaduan" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Detail Laporan Warga</h1>
          <p className="text-neutral-600 font-mono mt-1">Tiket: {pengaduan.tiket}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Detail Laporan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6 border-b-2 border-neutral-100 pb-4">
              <div>
                <span className="text-xs font-bold text-accent-700 uppercase tracking-wider mb-1 block">{pengaduan.kategori}</span>
                <h2 className="font-heading text-xl font-bold text-neutral-900">{pengaduan.judul}</h2>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                <Badge variant={getStatusVariant(pengaduan.status)}>{pengaduan.status}</Badge>
                {pengaduan.is_public && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-sm border border-green-200">
                    <Globe size={12}/> Publik
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-neutral-50 p-4 rounded-md border border-neutral-200">
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1 flex items-center gap-1"><User size={12}/> Pelapor</p>
                <p className="text-neutral-900 font-bold text-sm">{pengaduan.nama_pelapor}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1 flex items-center gap-1"><Phone size={12}/> Kontak</p>
                <p className="text-neutral-900 font-medium text-sm">{pengaduan.kontak || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Waktu</p>
                <p className="text-neutral-900 font-medium text-sm">
                  {new Date(pengaduan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-neutral-500 mb-2 flex items-center gap-2"><MessageSquare size={16}/> Isi Laporan</p>
              <div className="bg-white p-4 rounded-md border-2 border-neutral-200">
                <p className="text-neutral-800 whitespace-pre-wrap">{pengaduan.isi}</p>
              </div>
            </div>
            
            {/* Tampilkan Lampiran jika ada */}
            {fileLampiranUrl && (
               <div className="mt-6 pt-6 border-t-2 border-neutral-100">
                <p className="text-sm font-bold text-neutral-500 mb-3">Bukti Lampiran (Foto/Video)</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={fileLampiranUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold py-2.5 px-4 rounded-md border border-primary-300 transition-colors text-sm"
                  >
                    <Eye size={18} /> Lihat Bukti
                  </a>
                  <a 
                    href={fileLampiranDownloadUrl} 
                    className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm"
                  >
                    <Download size={18} /> Unduh
                  </a>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Update Tanggapan */}
        <div className="lg:col-span-1">
          <FormTanggapanPengaduan 
            id={id} 
            currentStatus={pengaduan.status} 
            currentTanggapan={pengaduan.tanggapan_admin || ""} 
            isPublic={pengaduan.is_public}
          />
        </div>

      </div>
    </div>
  );
}