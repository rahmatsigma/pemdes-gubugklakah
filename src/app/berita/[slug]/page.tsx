// Path: src/app/berita/[slug]/page.tsx
// Dibuat baru

import { createClient } from "../../../utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

// Next.js v15 (dan terbaru) mengharuskan params diawait karena sifatnya asynchronous
type Params = Promise<{ slug: string }>;

// Generate Metadata dinamis untuk SEO (Share WhatsApp/Facebook)
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("title, content").eq("slug", slug).single();

  if (!post) return { title: "Berita Tidak Ditemukan" };

  return {
    title: `${post.title} | Pemdes Gubugklakah`,
    description: post.content.substring(0, 150) + "...",
  };
}

export default async function DetailBerita({ params }: { params: Params }) {
  // 1. Dapatkan param slug (wajib pakai await di Next.js terbaru)
  const { slug } = await params;
  
  const supabase = await createClient();

  // 2. Ambil 1 berita spesifik berdasarkan slug
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single(); // .single() memaksa hasil berupa object tunggal, bukan array

  // 3. Jika berita tidak ada di database, lemparkan ke halaman 404
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-20 pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <Link 
          href="/berita" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar Berita
        </Link>

        {/* Artikel Utama */}
        <article className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
          {/* Header Artikel */}
          <div className="p-6 sm:p-10 border-b-2 border-neutral-100">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="flex items-center gap-1.5 bg-accent-100 text-accent-800 px-3 py-1 rounded-sm text-sm font-bold uppercase">
                <Tag size={16} /> {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium">
                <Calendar size={16} /> {new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              {post.title}
            </h1>
          </div>

          {/* Gambar Utama */}
          <div className="w-full h-64 sm:h-96 bg-neutral-100 border-b-2 border-neutral-200">
            <img 
              src={post.image_url || "https://via.placeholder.com/1200x600.png?text=Gambar+Berita"} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Isi Artikel */}
          <div className="p-6 sm:p-10">
            <div className="prose prose-lg max-w-none text-neutral-700 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}