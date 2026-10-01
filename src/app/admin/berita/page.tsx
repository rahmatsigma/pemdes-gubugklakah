// Path: src/app/admin/berita/page.tsx
// Dibuat baru

import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import DeleteBeritaButton from "./DeleteBeritaButton";

export default async function AdminBerita() {
  const supabase = await createClient();

  // Ambil semua berita, urutkan dari yang terbaru
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, category, is_published, created_at, slug")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Kelola Berita</h1>
          <p className="text-neutral-600">Daftar berita dan pengumuman desa.</p>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
        >
          <Plus size={20} /> Tulis Baru
        </Link>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-sm uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-6 py-4 font-bold">Judul Berita</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900 line-clamp-1">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-accent-100 text-accent-800 text-xs font-bold px-2.5 py-1 rounded-sm uppercase">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(post.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2.5 py-1 rounded-full border border-primary-200">Terbit</span>
                      ) : (
                        <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full border border-neutral-300">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Edit */}
                        <Link 
                          href={`/admin/berita/edit/${post.slug}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        
                        {/* Tombol Hapus (Client Component) */}
                        <DeleteBeritaButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                    Belum ada berita. Silakan klik "Tulis Baru".
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