// Path: src/app/umkm/page.tsx
// Dibuat baru - Katalog Produk UMKM untuk Publik dengan Integrasi WhatsApp

import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Store, Tag, BadgeCheck, Search } from "lucide-react";

export const revalidate = 60; // Cache halaman selama 1 menit

export default async function LapakUMKM(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  
  const supabase = await createClient();

  // Membangun query dengan JOIN ke tabel umkm_pelaku
  let queryBuilder = supabase
    .from("umkm_produk")
    .select(`
      id, nama_produk, deskripsi, harga, kategori, foto_url, is_unggulan,
      umkm:umkm_id (nama_usaha, nama_pemilik, nomor_wa, izin_publikasi_kontak)
    `)
    .eq("status_tersedia", true);

  // Jika ada pencarian, cari berdasarkan nama produk
  if (query) {
    queryBuilder = queryBuilder.ilike("nama_produk", `%${query}%`);
  }

  const { data: produk, error } = await queryBuilder
    .order("is_unggulan", { ascending: false }) // Tampilkan unggulan di atas
    .order("created_at", { ascending: false });

  // Helper untuk format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0 
    }).format(angka);
  };

  // Helper untuk membuat Link WhatsApp otomatis
  const generateWaLink = (phone: string, productName: string, storeName: string) => {
    // Pastikan format nomor diawali 62 atau kode negara
    const cleanPhone = phone.replace(/^0/, '62').replace(/\D/g, ''); 
    const message = `Halo Admin ${storeName},\n\nSaya melihat produk *${productName}* di Katalog Web Desa Gubugklakah. Apakah produk ini masih tersedia dan bisa saya pesan?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-neutral-200 pb-6 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-800 font-bold px-3 py-1 rounded-full border-2 border-accent-300 mb-4 text-sm">
              <ShoppingBag size={16} /> Lapak Desa
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Produk Unggulan UMKM</h1>
            <p className="text-lg text-neutral-600">
              Dukung perekonomian lokal Desa Gubugklakah dengan membeli produk-produk asli karya warga desa.
            </p>
          </div>

          {/* Form Pencarian Sederhana */}
          <form action="/umkm" method="GET" className="flex w-full md:w-auto">
            <input 
              type="text" 
              name="query"
              defaultValue={query}
              placeholder="Cari produk..." 
              className="bg-white border-2 border-neutral-300 border-r-0 text-neutral-900 text-sm rounded-l-md focus:ring-primary-500 focus:border-primary-500 block w-full md:w-64 p-3 outline-none font-medium"
            />
            <button type="submit" className="bg-primary-600 text-white border-2 border-primary-600 hover:bg-primary-700 font-bold rounded-r-md px-4 text-sm transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* DAFTAR PRODUK GRID */}
        {produk && produk.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produk.map((item: any) => {
              // Cast data JOIN dari Supabase
              const umkm = Array.isArray(item.umkm) ? item.umkm[0] : item.umkm;
              
              return (
                <div key={item.id} className="bg-white border-2 border-neutral-900 rounded-lg overflow-hidden flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group">
                  
                  {/* FOTO PRODUK (Placeholder jika tidak ada) */}
                  <div className="h-48 bg-neutral-200 border-b-2 border-neutral-900 relative">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.nama_produk} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 group-hover:text-primary-500 transition-colors">
                        <ShoppingBag size={48} opacity={0.5} />
                      </div>
                    )}
                    
                    {/* Badge Unggulan */}
                    {item.is_unggulan && (
                      <div className="absolute top-3 right-3 bg-accent-400 text-neutral-900 font-bold text-xs px-3 py-1.5 rounded-full border-2 border-neutral-900 flex items-center gap-1 shadow-sm">
                        <BadgeCheck size={14} /> Unggulan
                      </div>
                    )}
                  </div>

                  {/* INFO PRODUK */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-sm border border-neutral-200 uppercase tracking-wider">
                        {item.kategori}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-neutral-900 mb-1 leading-tight line-clamp-2">
                      {item.nama_produk}
                    </h3>
                    
                    <p className="text-2xl font-bold text-primary-700 mb-3">
                      {formatRupiah(item.harga)}
                    </p>

                    <p className="text-sm text-neutral-600 mb-6 line-clamp-2">
                      {item.deskripsi}
                    </p>

                    <div className="mt-auto pt-4 border-t-2 border-neutral-100">
                      <div className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-4">
                        <Store size={16} className="text-neutral-500" /> 
                        <span className="truncate">{umkm?.nama_usaha}</span>
                      </div>

                      {/* TOMBOL WHATSAPP */}
                      {umkm?.izin_publikasi_kontak ? (
                        <a 
                          href={generateWaLink(umkm.nomor_wa, item.nama_produk, umkm.nama_usaha)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 px-4 rounded-md transition-colors text-sm border-2 border-[#1da851]"
                        >
                          <MessageCircle size={18} /> Hubungi via WhatsApp
                        </a>
                      ) : (
                        <p className="text-xs text-neutral-400 italic text-center">Kontak tidak tersedia secara publik.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center col-span-full">
            <ShoppingBag size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="font-bold text-neutral-700 text-lg">Belum ada produk UMKM</h3>
            <p className="text-neutral-500">Produk dari pelaku UMKM Desa Gubugklakah akan ditampilkan di sini.</p>
          </div>
        )}

      </div>
    </div>
  );
}