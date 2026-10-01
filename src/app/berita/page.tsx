// Path: src/app/berita/page.tsx
// Dibuat baru

import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kabar Desa | Pemdes Gubugklakah",
  description: "Berita, pengumuman, dan kegiatan terbaru Pemerintah Desa Gubugklakah.",
};

export default async function DaftarBerita() {
  const supabase = await createClient();

  // Mengambil semua berita yang sudah dipublikasikan, urut terbaru
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, category, image_url, created_at, content")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Header */}
      <section className="bg-primary-900 text-white py-16 border-b-8 border-accent-500 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Kabar Desa</h1>
          <p className="text-xl text-primary-100">
            Informasi, Pengumuman, dan Kegiatan Terbaru Desa Gubugklakah
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden flex flex-col hover:border-primary-500 transition-colors">
                {/* Gambar Thumbnail */}
                <div className="h-48 bg-neutral-200 w-full border-b-2 border-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={post.image_url || "https://via.placeholder.com/800x400.png?text=Berita"} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Konten Card */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-accent-100 text-accent-800 text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-neutral-500 text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  <h2 className="font-heading text-xl font-bold text-neutral-900 mb-3 line-clamp-2">
                    <Link href={`/berita/${post.slug}`} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  {/* Potongan teks isi berita */}
                  <p className="text-neutral-600 text-sm mb-6 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      href={`/berita/${post.slug}`}
                      className="inline-flex items-center justify-center w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-2 px-4 rounded-md border border-primary-200 transition-colors"
                    >
                      Baca Selengkapnya <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white border-2 border-dashed border-neutral-300 rounded-lg">
              <p className="text-neutral-500 font-medium">Belum ada berita yang diterbitkan saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}