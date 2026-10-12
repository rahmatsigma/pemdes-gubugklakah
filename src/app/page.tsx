import { createClient } from "../utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Megaphone, CheckCircle2, ShieldCheck, FileSignature, Newspaper, Users, FileText } from "lucide-react";

export default async function Beranda() {
  const supabase = await createClient();

  // 1. Mengambil statistik jumlah surat yang sudah selesai
  const { count: suratSelesai } = await supabase
    .from("permohonan_surat")
    .select("*", { count: "exact", head: true })
    .eq("status", "Selesai");

  // 2. Mengambil 3 pengaduan publik terbaru
  const { data: pengaduanPublik } = await supabase
    .from("pengaduan")
    .select("id, kategori, judul, isi, tanggapan_admin, created_at, status")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      
      {/* HERO SECTION */}
      <section className="bg-primary-900 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 border-b-8 border-accent-500 relative overflow-hidden">
        {/* Ornamen latar belakang Flat Design */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-800 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 -left-10 w-48 h-48 bg-accent-500 rounded-full opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <BadgeTransparansi count={suratSelesai || 0} />
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Desa Digital <span className="text-accent-400">Gubugklakah</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            Pelayanan administrasi transparan, cepat, dan responsif dalam genggaman Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/layanan" 
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold py-4 px-8 rounded-md transition-colors border-2 border-accent-600 text-lg"
            >
              <FileSignature size={24} /> Urus Surat Online
            </Link>
            <Link 
              href="/pengaduan" 
              className="inline-flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-md transition-colors border-2 border-primary-700 text-lg"
            >
              <Megaphone size={24} /> Lapor Pemerintah Desa
            </Link>
          </div>
        </div>
      </section>

      {/* MENU CEPAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MenuCard title="Profil Desa" icon={Users} href="/profil" desc="Mengenal lebih dekat Gubugklakah" />
          <MenuCard title="Pemerintahan" icon={ShieldCheck} href="/pemerintahan" desc="Struktur dan aparatur desa" />
          <MenuCard title="Pusat Dokumen" icon={FileText} href="/dokumen" desc="Unduh perdes dan laporan" />
          <MenuCard title="Berita Desa" icon={Newspaper} href="/berita" desc="Informasi dan kegiatan terbaru" />
        </div>
      </section>

      {/* SUARA WARGA (PENGADUAN PUBLIK) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b-4 border-neutral-200 pb-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 flex items-center gap-2">
              <Megaphone className="text-primary-600" size={32} /> Suara Warga
            </h2>
            <p className="text-neutral-600 mt-2">Tindak lanjut transparan atas laporan dan masukan warga.</p>
          </div>
          <Link href="/pengaduan" className="hidden sm:flex items-center font-bold text-primary-600 hover:text-primary-700">
            Buat Laporan <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {pengaduanPublik && pengaduanPublik.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pengaduanPublik.map((adu) => (
              <div key={adu.id} className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm flex flex-col hover:border-primary-400 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-sm border border-neutral-200 uppercase tracking-wider">
                    {adu.kategori}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {new Date(adu.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <h3 className="font-heading text-lg font-bold text-neutral-900 mb-2 leading-tight">
                  {adu.judul}
                </h3>
                <p className="text-sm text-neutral-600 mb-6 line-clamp-3">
                  "{adu.isi}"
                </p>

                {/* Tanggapan Admin Panel */}
                <div className="mt-auto bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-md">
                  <p className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Tanggapan Pemdes:
                  </p>
                  <p className="text-sm text-primary-900 font-medium italic">
                    {adu.tanggapan_admin || "Sedang ditindaklanjuti..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
            <ShieldCheck size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="font-bold text-neutral-700 text-lg">Belum ada pengaduan publik</h3>
            <p className="text-neutral-500">Laporan warga yang telah direspons dan diizinkan tampil akan muncul di sini.</p>
          </div>
        )}
        
        <Link href="/pengaduan" className="sm:hidden flex justify-center items-center gap-2 mt-6 font-bold text-primary-600 bg-primary-50 py-3 rounded-md border border-primary-200">
          Buat Laporan Baru <ArrowRight size={18} />
        </Link>
      </section>

    </div>
  );
}

// Komponen Helper Internal
function BadgeTransparansi({ count }: { count: number }) {
  return (
    <div className="inline-flex items-center gap-2 bg-primary-800 border-2 border-primary-700 rounded-full px-4 py-1.5 mb-8 shadow-sm">
      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-sm font-bold text-primary-100 tracking-wide">
        Transparansi: <span className="text-white">{count} Surat</span> Selesai Diproses
      </span>
    </div>
  );
}

function MenuCard({ title, icon: Icon, href, desc }: { title: string, icon: any, href: string, desc: string }) {
  return (
    <Link 
      href={href}
      className="bg-white border-2 border-neutral-200 hover:border-primary-500 hover:shadow-[4px_4px_0px_0px_rgba(79,70,229,0.2)] rounded-lg p-6 transition-all group flex flex-col items-center text-center"
    >
      <div className="bg-primary-50 text-primary-600 p-4 rounded-full mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
        <Icon size={32} />
      </div>
      <h3 className="font-heading font-bold text-neutral-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-neutral-500">{desc}</p>
    </Link>
  );
}