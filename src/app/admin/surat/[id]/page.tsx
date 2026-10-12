// Path: src/app/admin/surat/[id]/page.tsx
// Edit (Memisahkan tombol Lihat dan Unduh file)

import { createClient } from "../../../../utils/supabase/server";
import { createAdminClient } from "../../../../utils/supabase/admin";
import Link from "next/link";
import { ArrowLeft, User, FileText, Phone, Calendar, Download, Eye } from "lucide-react";
import Badge from "../../../../components/ui/badge";
import FormUpdateStatus from "./FormUpdateStatus";

export default async function DetailSuratAdmin(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(); 

  // Ambil detail surat
  const { data: permohonan, error } = await supabase
    .from("permohonan_surat")
    .select(`
      *,
      jenis_surat:jenis_surat_id (nama)
    `)
    .eq("id", id)
    .single();

  if (error || !permohonan) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-500 mb-4">Data permohonan tidak ditemukan.</p>
        <Link href="/admin/surat" className="text-primary-600 font-bold hover:underline">
          &larr; Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const safeData = permohonan as any;
  const namaSurat = Array.isArray(safeData.jenis_surat) ? safeData.jenis_surat[0]?.nama : safeData.jenis_surat?.nama;

  // GENERATE SIGNED URL SEMENTARA
  let fileSyaratUrl = "";
  let fileSyaratDownloadUrl = "";
  
  if (safeData.file_syarat_url) {
    // 1. URL untuk PREVIEW (Buka di tab baru)
    const { data: urlData } = await supabaseAdmin.storage
      .from("berkas_syarat")
      .createSignedUrl(safeData.file_syarat_url, 600); 
      
    if (urlData) {
      fileSyaratUrl = urlData.signedUrl;
    }

    // 2. URL untuk FORCE DOWNLOAD (Langsung simpan ke laptop)
    const { data: downloadData } = await supabaseAdmin.storage
      .from("berkas_syarat")
      .createSignedUrl(safeData.file_syarat_url, 600, {
        download: true // Fitur Supabase untuk memaksa unduhan
      });
      
    if (downloadData) {
      fileSyaratDownloadUrl = downloadData.signedUrl;
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai": return "success";
      case "Ditolak": return "danger";
      case "Diverifikasi":
      case "Diproses": return "warning";
      default: return "info";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/surat" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Detail Permohonan</h1>
          <p className="text-neutral-600 font-mono mt-1">Tiket: {safeData.tiket}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Detail Data Pemohon */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b-2 border-neutral-100 pb-4">
              <h2 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2">
                <FileText size={20} className="text-primary-600"/> Data Pengajuan
              </h2>
              <Badge variant={getStatusVariant(safeData.status)}>{safeData.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-neutral-500 mb-1 flex items-center gap-1"><User size={14}/> Nama Lengkap</p>
                <p className="text-neutral-900 font-medium">{safeData.nama}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 mb-1 flex items-center gap-1"><User size={14}/> NIK</p>
                <p className="text-neutral-900 font-medium font-mono">{safeData.nik}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 mb-1 flex items-center gap-1"><Phone size={14}/> Nomor WhatsApp</p>
                <p className="text-neutral-900 font-medium">{safeData.kontak}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-500 mb-1 flex items-center gap-1"><Calendar size={14}/> Tanggal Pengajuan</p>
                <p className="text-neutral-900 font-medium">
                  {new Date(safeData.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-neutral-100">
              <p className="text-sm font-bold text-neutral-500 mb-2">Jenis Surat yang Diminta</p>
              <p className="text-lg font-bold text-primary-700">{namaSurat}</p>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-neutral-100">
              <p className="text-sm font-bold text-neutral-500 mb-2">Keperluan Permohonan</p>
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <p className="text-neutral-800">{safeData.keperluan}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2 mb-4">
              <FileText size={20} className="text-primary-600"/> Berkas Persyaratan
            </h2>
            
            <p className="text-sm text-neutral-600 mb-4">
              Silakan periksa berkas KTP/KK warga untuk keperluan verifikasi.
            </p>

            {fileSyaratUrl ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={fileSyaratUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold py-2.5 px-4 rounded-md border border-primary-300 transition-colors"
                >
                  <Eye size={20} /> Lihat Berkas
                </a>
                <a 
                  href={fileSyaratDownloadUrl} 
                  className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
                >
                  <Download size={20} /> Unduh
                </a>
              </div>
            ) : (
              <p className="text-red-500 text-sm font-bold">Warga tidak mengunggah file persyaratan atau file tidak ditemukan.</p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Update Status */}
        <div className="lg:col-span-1">
          <FormUpdateStatus 
            id={id} 
            currentStatus={safeData.status} 
            currentCatatan={safeData.catatan_admin || ""} 
          />
        </div>

      </div>
    </div>
  );
}