// Path: src/app/page.tsx
// Diedit

import Link from "next/link";
import { ArrowRight, MapPin, Users, Home as HomeIcon } from "lucide-react";
import { createClient } from "../utils/supabase/server";

// Mendefinisikan tipe data untuk Post agar TypeScript tidak protes
type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image_url: string;
  created_at: string;
};

export default async function Home() {
  // 1. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 2. Ambil 3 berita terbaru yang statusnya published
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, category, image_url, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div>
      {/* --- HERO SECTION --- */}
      {/* Flat design: Warna solid hijau tua, tanpa gambar background kompleks */}
      <section className="bg-primary-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b-8 border-accent-500">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Selamat Datang di Portal Resmi<br />
            <span className="text-accent-400">Pemerintah Desa Gubugklakah</span>
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            Kecamatan Poncokusumo, Kabupaten Malang. Mewujudkan desa yang mandiri, sejahtera, dan transparan melalui pelayanan digital.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/profil" 
              className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold px-6 py-3 rounded-md transition-colors"
            >
              Profil Desa
            </Link>
            <Link 
              href="/berita" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-900 font-bold px-6 py-3 rounded-md transition-colors"
            >
              Kabar Desa
            </Link>
          </div>
        </div>
      </section>

      {/* --- STATISTIK RINGKAS SECTION --- */}
      <section className="py-12 bg-neutral-50 border-b-4 border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu Statistik - Flat, solid border */}
            <div className="bg-white p-6 border-2 border-neutral-200 rounded-lg text-center">
              <Users className="mx-auto h-12 w-12 text-primary-500 mb-4" />
              <h3 className="font-heading text-3xl font-bold text-neutral-900">4,500+</h3>
              <p className="text-neutral-600 font-medium">Jiwa Penduduk</p>
            </div>
            <div className="bg-white p-6 border-2 border-neutral-200 rounded-lg text-center">
              <HomeIcon className="mx-auto h-12 w-12 text-accent-500 mb-4" />
              <h3 className="font-heading text-3xl font-bold text-neutral-900">1,200+</h3>
              <p className="text-neutral-600 font-medium">Kepala Keluarga</p>
            </div>
            <div className="bg-white p-6 border-2 border-neutral-200 rounded-lg text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary-500 mb-4" />
              <h3 className="font-heading text-3xl font-bold text-neutral-900">4</h3>
              <p className="text-neutral-600 font-medium">Dusun Wilayah</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BERITA TERBARU SECTION --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-neutral-900">Kabar Desa Terbaru</h2>
              <div className="h-1 w-20 bg-accent-500 mt-2"></div>
            </div>
            <Link href="/berita" className="hidden sm:flex items-center text-primary-600 hover:text-primary-800 font-medium">
              Lihat Semua <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          {/* Grid Berita */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts && posts.length > 0 ? (
              posts.map((post: Post) => (
                <div key={post.id} className="border-2 border-neutral-200 rounded-lg overflow-hidden flex flex-col">
                  {/* Gambar Dummy (jika null, pakai fallback) */}
                  <div className="h-48 bg-neutral-200 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.image_url || "https://via.placeholder.com/800x400.png?text=Tidak+Ada+Gambar"} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Konten Berita */}
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-accent-100 text-accent-700 text-xs font-bold px-2 py-1 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-neutral-500 text-sm">
                        {new Date(post.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
                      <Link href={`/berita/${post.slug}`} className="hover:text-primary-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <div className="mt-auto pt-4">
                      <Link 
                        href={`/berita/${post.slug}`}
                        className="text-primary-600 hover:text-primary-800 font-bold text-sm inline-flex items-center"
                      >
                        Baca Selengkapnya <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 bg-neutral-50 border-2 border-neutral-200 rounded-lg">
                <p className="text-neutral-500">Belum ada berita yang dipublikasikan.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/berita" className="inline-flex items-center text-primary-600 font-medium">
              Lihat Semua <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}