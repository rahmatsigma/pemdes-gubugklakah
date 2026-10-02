// Path: src/app/admin/perangkat/page.tsx
// Dibuat baru

import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, UserCircle } from "lucide-react";
import DeletePerangkatButton from "./DeletePerangkatButton";

export default async function AdminPerangkat() {
  const supabase = await createClient();

  // Ambil data perangkat desa, urutkan berdasarkan order_index (jabatan tertinggi ke terendah)
  const { data: officials } = await supabase
    .from("officials")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Kelola Perangkat Desa</h1>
          <p className="text-neutral-600">Atur struktur organisasi dan staf pemerintahan desa.</p>
        </div>
        <Link 
          href="/admin/perangkat/tambah" 
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold py-2.5 px-4 rounded-md transition-colors"
        >
          <Plus size={20} /> Tambah Staf
        </Link>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-sm uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-6 py-4 font-bold text-center">Foto</th>
                <th className="px-6 py-4 font-bold">Nama & Jabatan</th>
                <th className="px-6 py-4 font-bold text-center">No. Urut</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              {officials && officials.length > 0 ? (
                officials.map((official) => (
                  <tr key={official.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-neutral-300 overflow-hidden bg-neutral-100 flex items-center justify-center">
                          {official.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={official.image_url} 
                              alt={official.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle className="text-neutral-400 w-8 h-8" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-neutral-900">{official.name}</p>
                      <span className="inline-block bg-primary-100 text-primary-800 text-xs font-bold px-2 py-0.5 rounded-sm mt-1">
                        {official.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-neutral-500">
                      {official.order_index}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Edit */}
                        <Link 
                          href={`/admin/perangkat/edit/${official.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        
                        {/* Tombol Hapus */}
                        <DeletePerangkatButton id={official.id} name={official.name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-neutral-500">
                    Data perangkat desa masih kosong. Silakan klik "Tambah Staf".
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