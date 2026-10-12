// Path: src/app/admin/surat/page.tsx
// Dibuat baru

import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Eye, Search, Inbox } from "lucide-react";
import Badge from "../../../components/ui/badge";

export default async function AdminDaftarSurat() {
  const supabase = await createClient();

  // Ambil semua data permohonan surat dari yang terbaru
  const { data: permohonan } = await supabase
    .from("permohonan_surat")
    .select(`
      id,
      tiket,
      nama,
      status,
      created_at,
      jenis_surat:jenis_surat_id (nama)
    `)
    .order("created_at", { ascending: false });

  // Fungsi helper warna badge status
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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Antrean Surat Warga</h1>
          <p className="text-neutral-600">Pantau dan proses permohonan surat keterangan dari warga.</p>
        </div>
        
        {/* Fitur Search Sederhana (UI Only untuk MVP) */}
        <div className="flex w-full sm:w-auto bg-white border-2 border-neutral-200 rounded-md px-3 py-2">
          <Search size={20} className="text-neutral-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari Kode Tiket..." 
            className="bg-transparent focus:outline-none w-full text-sm"
            disabled
          />
        </div>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-xs uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-6 py-4 font-bold">Kode Tiket</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Nama Pemohon</th>
                <th className="px-6 py-4 font-bold">Jenis Surat</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700 text-sm">
              {permohonan && permohonan.length > 0 ? (
                // Cast ke any[] agar TypeScript tidak protes soal join relasi jenis_surat
                (permohonan as any[]).map((item) => {
                  const namaSurat = Array.isArray(item.jenis_surat) ? item.jenis_surat[0]?.nama : item.jenis_surat?.nama;
                  
                  return (
                    <tr key={item.id} className="hover:bg-primary-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-primary-700 bg-primary-100 px-2 py-1 rounded-sm border border-primary-200">
                          {item.tiket}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-bold text-neutral-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4">
                        {namaSurat}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          href={`/admin/surat/${item.id}`}
                          className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-1.5 px-3 rounded-md border border-neutral-300 transition-colors"
                        >
                          <Eye size={16} /> Detail
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    <Inbox size={48} className="mx-auto mb-3 text-neutral-300" />
                    Belum ada antrean permohonan surat baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}