// Path: src/app/pemerintahan/page.tsx
// Dibuat baru

import { createClient } from "../../utils/supabase/server";
import { UserCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemerintahan Desa | Pemdes Gubugklakah",
  description: "Struktur Organisasi dan Perangkat Desa Gubugklakah.",
};

// Tipe data untuk perangkat desa
type Official = {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
};

export default async function PemerintahanDesa() {
  const supabase = await createClient();

  // Ambil data perangkat desa, urutkan berdasarkan order_index (0, 1, 2, dst)
  const { data: officials } = await supabase
    .from("officials")
    .select("id, name, position, image_url")
    .order("order_index", { ascending: true });

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Header Halaman */}
      <section className="bg-primary-900 text-white py-16 border-b-8 border-accent-500 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Pemerintahan Desa</h1>
          <p className="text-xl text-primary-100">
            Struktur Organisasi Pemerintah Desa Gubugklakah
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Penjelasan Singkat */}
        <div className="bg-white p-6 border-2 border-neutral-200 rounded-lg mb-10 text-center max-w-3xl mx-auto">
          <p className="text-neutral-700">
            Pemerintah Desa Gubugklakah dipimpin oleh seorang Kepala Desa, dibantu oleh Sekretaris Desa, para Kepala Urusan (Kaur), Kepala Seksi (Kasi), dan Kepala Dusun (Kasun) yang berkomitmen melayani masyarakat.
          </p>
        </div>

        {/* Grid Perangkat Desa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {officials && officials.length > 0 ? (
            officials.map((official: Official) => (
              <div 
                key={official.id} 
                className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden flex flex-col items-center text-center p-6 hover:border-primary-500 transition-colors"
              >
                {/* Foto Profil */}
                <div className="w-32 h-32 mb-4 rounded-full border-4 border-accent-100 overflow-hidden bg-neutral-100 flex items-center justify-center">
                  {official.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={official.image_url} 
                      alt={`Foto ${official.name}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-neutral-400" />
                  )}
                </div>
                
                {/* Nama & Jabatan */}
                <h3 className="font-heading font-bold text-lg text-neutral-900 mb-1">
                  {official.name}
                </h3>
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {official.position}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white border-2 border-dashed border-neutral-300 rounded-lg">
              <UserCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 font-medium">Data perangkat desa belum ditambahkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}