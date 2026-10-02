// Path: src/app/admin/dokumen/page.tsx
// Dibuat baru

import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteDokumenButton from "./DeleteDokumenButton";

export default async function AdminDokumen() {
  const supabase = await createClient();

  // Ambil semua dokumen urut terbaru
  const { data: documents } = await supabase
    .from("dokumen")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Kelola Dokumen</h1>
          <p className="text-neutral-600">Unggah dan atur dokumen publik, laporan, dan formulir desa.</p>
        </div>
        <Link 
          href="/admin/dokumen/tambah" 
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
        >
          <Plus size={20} /> Unggah Baru
        </Link>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-sm uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-6 py-4 font-bold">Judul Dokumen</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold text-center">Tahun</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              {documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{doc.judul}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-accent-100 text-accent-800 text-xs font-bold px-2.5 py-1 rounded-sm uppercase">
                        {doc.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-sm">
                      {doc.tahun || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {doc.is_published ? (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">Publik</span>
                      ) : (
                        <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full border border-neutral-300">Sembunyi</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Delete (Client Component) */}
                        <DeleteDokumenButton id={doc.id} judul={doc.judul} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    Belum ada dokumen. Silakan klik "Unggah Baru".
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