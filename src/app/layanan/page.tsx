import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { FileSignature, Clock, CheckCircle2, ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan Surat Online | Pemdes Gubugklakah",
  description: "Ajukan permohonan surat keterangan desa secara online dengan mudah dan cepat.",
};

export default async function LayananPublik() {
  const supabase = await createClient();

  // Mengambil daftar jenis surat yang berstatus aktif (RLS mengizinkan akses anonim untuk is_active = true)
  const { data: jenisSurat } = await supabase
    .from("jenis_surat")
    .select("*")
    .eq("is_active", true)
    .order("nama", { ascending: true });

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <section className="bg-primary-900 text-white py-16 border-b-8 border-accent-500 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Layanan Surat Online</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            Ajukan permohonan surat pengantar dan keterangan desa dari rumah. Cepat, mudah, dan transparan.
          </p>
          
          <Link 
            href="/layanan/lacak"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold py-3 px-8 rounded-md transition-colors border-2 border-accent-600"
          >
            <Search size={20} /> Lacak Status Surat Saya
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">Daftar Layanan Tersedia</h2>
          <p className="text-neutral-600">Pilih jenis surat yang ingin Anda ajukan untuk melihat persyaratan.</p>
        </div>

        {/* Grid Daftar Surat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jenisSurat && jenisSurat.length > 0 ? (
            jenisSurat.map((surat) => (
              <div key={surat.id} className="bg-white border-2 border-neutral-200 rounded-lg p-6 flex flex-col hover:border-primary-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-primary-100 text-primary-700 p-3 rounded-md shrink-0">
                    <FileSignature size={28} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-neutral-900 leading-tight mb-2">
                      {surat.nama}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-accent-700 bg-accent-50 inline-flex px-2 py-1 rounded-sm border border-accent-100">
                      <Clock size={14} /> Estimasi: {surat.estimasi_hari} Hari Kerja
                    </div>
                  </div>
                </div>

                <div className="flex-1 mt-2">
                  <p className="text-sm font-bold text-neutral-700 mb-2">Persyaratan:</p>
                  <ul className="space-y-1.5 mb-6">
                    {surat.persyaratan.split('\n').map((syarat: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{syarat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  // Kita lempar ID jenis surat ke halaman pengajuan via URL Query
                  href={`/layanan/pengajuan?jenis=${surat.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-2.5 px-4 rounded-md border border-primary-200 transition-colors mt-auto"
                >
                  Buat Surat Ini <ArrowRight size={18} />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white border-2 border-dashed border-neutral-300 rounded-lg">
              <p className="text-neutral-500 font-medium">Layanan surat sedang dalam pemeliharaan.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}