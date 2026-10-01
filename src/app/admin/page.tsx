// Path: src/app/admin/page.tsx
// Dibuat baru

import { createClient } from "../../utils/supabase/server";
import { Newspaper, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Hitung jumlah berita
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  // Hitung jumlah perangkat desa
  const { count: officialsCount } = await supabase
    .from("officials")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Dashboard Admin</h1>
      <p className="text-neutral-600 mb-8">
        Selamat datang di pusat kendali website Pemerintah Desa Gubugklakah.
      </p>

      {/* Kartu Ringkasan (Statistik) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Statistik Berita */}
        <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium mb-1">Total Berita</p>
            <h3 className="font-heading text-4xl font-bold text-primary-600">{postsCount || 0}</h3>
          </div>
          <div className="bg-primary-50 p-4 rounded-md border border-primary-100">
            <Newspaper className="text-primary-500 h-8 w-8" />
          </div>
        </div>

        {/* Statistik Perangkat Desa */}
        <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium mb-1">Perangkat Desa</p>
            <h3 className="font-heading text-4xl font-bold text-accent-500">{officialsCount || 0}</h3>
          </div>
          <div className="bg-accent-50 p-4 rounded-md border border-accent-100">
            <Users className="text-accent-500 h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Navigasi Cepat (Quick Actions) */}
      <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/admin/berita"
          className="bg-white border-2 border-neutral-200 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors group flex items-center gap-4"
        >
          <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
            <Newspaper size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-primary-700">Tulis Berita Baru</h3>
            <p className="text-neutral-500 text-sm">Buat pengumuman atau kegiatan desa terbaru.</p>
          </div>
        </Link>

        <Link 
          href="/admin/perangkat"
          className="bg-white border-2 border-neutral-200 rounded-lg p-6 hover:border-accent-500 hover:bg-accent-50 transition-colors group flex items-center gap-4"
        >
          <div className="bg-accent-100 text-accent-600 p-3 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-accent-700">Kelola Perangkat Desa</h3>
            <p className="text-neutral-500 text-sm">Update data dan foto profil staf pemerintahan.</p>
          </div>
        </Link>
      </div>

    </div>
  );
}