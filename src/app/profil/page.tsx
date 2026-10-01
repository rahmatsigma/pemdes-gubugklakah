// Path: src/app/profil/page.tsx
// Dibuat baru

import { Map, Target, Flag, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Desa | Pemdes Gubugklakah",
  description: "Sejarah, Visi, Misi, dan Potensi Desa Gubugklakah.",
};

export default function ProfilDesa() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header Halaman */}
      <section className="bg-primary-900 text-white py-16 border-b-8 border-accent-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Profil Desa Gubugklakah</h1>
          <p className="text-xl text-primary-100">Mengenal lebih dekat sejarah, visi, dan potensi desa kami.</p>
        </div>
      </section>

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Visi Misi & Sejarah (Lebar 2 kolom) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visi & Misi */}
            <div className="bg-white p-8 border-2 border-neutral-200 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-accent-500 h-8 w-8" />
                <h2 className="font-heading text-2xl font-bold text-neutral-900">Visi & Misi</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-lg text-primary-700 mb-2">Visi:</h3>
                <p className="text-neutral-700 italic border-l-4 border-accent-500 pl-4 py-2 bg-neutral-50">
                  "Terwujudnya Desa Gubugklakah yang Mandiri, Sejahtera, dan Berbudaya melalui Pengembangan Pariwisata Berbasis Masyarakat."
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">Misi:</h3>
                <ul className="list-decimal list-inside space-y-2 text-neutral-700">
                  <li>Meningkatkan kualitas tata kelola pemerintahan desa yang transparan dan akuntabel.</li>
                  <li>Mengembangkan potensi pariwisata alam dan budaya secara berkelanjutan.</li>
                  <li>Meningkatkan kesejahteraan ekonomi masyarakat melalui pemberdayaan UMKM dan Kelompok Sadar Wisata (Pokdarwis).</li>
                  <li>Melestarikan nilai-nilai adat dan budaya lokal melalui Lembaga Adat Desa.</li>
                </ul>
              </div>
            </div>

            {/* Sejarah Desa */}
            <div className="bg-white p-8 border-2 border-neutral-200 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Flag className="text-primary-500 h-8 w-8" />
                <h2 className="font-heading text-2xl font-bold text-neutral-900">Sejarah Singkat</h2>
              </div>
              <div className="prose text-neutral-700 max-w-none">
                <p className="mb-4">
                  Desa Gubugklakah memiliki akar sejarah yang kuat dan erat kaitannya dengan kawasan lereng Gunung Bromo. Konon, nama "Gubugklakah" berasal dari kata "Gubug" (tempat singgah sementara) dan "Klakah" yang merujuk pada material bambu atau kayu khas daerah tersebut.
                </p>
                <p>
                  Sejak dahulu, desa ini menjadi jalur persinggahan penting bagi para pelancong dan pendaki yang menuju kawasan Taman Nasional Bromo Tengger Semeru. Masyarakat desa memegang teguh tradisi leluhur yang kini dilestarikan melalui Lembaga Adat Desa, hidup berdampingan dengan alam, dan mengelola potensi pertanian, khususnya perkebunan apel yang menjadi ciri khas daerah Poncokusumo.
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Letak Geografis & Potensi */}
          <div className="space-y-8">
            
            {/* Letak Geografis */}
            <div className="bg-primary-50 p-6 border-2 border-primary-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Map className="text-primary-600 h-6 w-6" />
                <h2 className="font-heading text-xl font-bold text-primary-900">Letak Geografis</h2>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex justify-between border-b border-primary-200 pb-2">
                  <span className="font-medium">Kecamatan</span>
                  <span>Poncokusumo</span>
                </li>
                <li className="flex justify-between border-b border-primary-200 pb-2">
                  <span className="font-medium">Kabupaten</span>
                  <span>Malang</span>
                </li>
                <li className="flex justify-between border-b border-primary-200 pb-2">
                  <span className="font-medium">Provinsi</span>
                  <span>Jawa Timur</span>
                </li>
                <li className="pt-2">
                  <span className="font-medium block mb-1">Batas Wilayah:</span>
                  <ul className="list-disc list-inside ml-2">
                    <li>Utara: Desa Poncokusumo</li>
                    <li>Selatan: Kawasan Hutan Perhutani</li>
                    <li>Timur: TN Bromo Tengger Semeru</li>
                    <li>Barat: Desa Wringinanom</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Potensi Desa */}
            <div className="bg-accent-50 p-6 border-2 border-accent-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-accent-600 h-6 w-6" />
                <h2 className="font-heading text-xl font-bold text-accent-900">Potensi Unggulan</h2>
              </div>
              <ul className="space-y-3 text-sm text-neutral-800">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-500 mt-1.5 flex-shrink-0"></div>
                  <span><strong>Pariwisata Alam:</strong> Air Terjun Coban Pelangi, Rest Area, dan jalur utama menuju Gunung Bromo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-500 mt-1.5 flex-shrink-0"></div>
                  <span><strong>Agrowisata:</strong> Perkebunan Apel dan sayur-mayur dataran tinggi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-500 mt-1.5 flex-shrink-0"></div>
                  <span><strong>Desa Wisata Berprestasi:</strong> Diakui secara nasional dengan dukungan kuat dari Pokdarwis dan Karang Taruna.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}