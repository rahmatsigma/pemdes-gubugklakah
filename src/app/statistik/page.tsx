import { createClient } from "../../utils/supabase/server";
import { Users, Home, Activity } from "lucide-react";
import SimpleBarChart from "../../components/ui/SimpleBarChart";

export const revalidate = 3600;

export default async function StatistikDesa() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("statistik_kependudukan")
    .select("*")
    .single();

  const stats = data || { total_penduduk: 0, total_kk: 0, total_laki_laki: 0, total_perempuan: 0 };

  // Mapping data untuk Recharts
  const chartDataGender = [
    { kategori: "Laki-laki", jumlah: stats.total_laki_laki },
    { kategori: "Perempuan", jumlah: stats.total_perempuan },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 border-b-4 border-neutral-200 pb-6">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Statistik Desa</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Transparansi data kependudukan Desa Gubugklakah secara agregat. 
            Data individu warga dilindungi secara ketat sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP).
          </p>
        </div>

        {/* KARTU RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-600 uppercase tracking-wider text-sm">Total Penduduk</h3>
              <div className="bg-primary-100 p-2 rounded-md border-2 border-primary-200">
                <Users size={24} className="text-primary-700" />
              </div>
            </div>
            <p className="text-5xl font-heading font-bold text-neutral-900">{stats.total_penduduk}</p>
            <p className="text-sm font-medium text-neutral-500 mt-2">Jiwa Warga Tetap</p>
          </div>

          <div className="bg-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-600 uppercase tracking-wider text-sm">Kepala Keluarga</h3>
              <div className="bg-accent-100 p-2 rounded-md border-2 border-accent-200">
                <Home size={24} className="text-accent-700" />
              </div>
            </div>
            <p className="text-5xl font-heading font-bold text-neutral-900">{stats.total_kk}</p>
            <p className="text-sm font-medium text-neutral-500 mt-2">Keluarga Tercatat</p>
          </div>

          <div className="bg-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-600 uppercase tracking-wider text-sm">Rasio Gender</h3>
              <div className="bg-blue-100 p-2 rounded-md border-2 border-blue-200">
                <Activity size={24} className="text-blue-700" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-heading font-bold text-neutral-900">{stats.total_laki_laki}</p>
              <span className="text-xl font-bold text-neutral-400 mb-1">/</span>
              <p className="text-3xl font-heading font-bold text-neutral-700 mb-1">{stats.total_perempuan}</p>
            </div>
            <p className="text-sm font-medium text-neutral-500 mt-2">Laki-laki / Perempuan</p>
          </div>
        </div>

        {/* GRAFIK RECHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-neutral-900 mb-6 border-b-2 border-neutral-100 pb-2">
              Distribusi Jenis Kelamin
            </h2>
            <SimpleBarChart 
              data={chartDataGender} 
              dataKey="jumlah" 
              categoryKey="kategori" 
              color="#4f46e5" // Warna primary tailwind
            />
          </div>

          <div className="bg-neutral-800 text-white border-2 border-neutral-900 rounded-lg p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
            <h2 className="font-heading text-2xl font-bold mb-4 text-accent-400">Komitmen Keamanan Data</h2>
            <p className="text-neutral-300 font-medium leading-relaxed mb-4">
              Pemerintah Desa Gubugklakah menerapkan teknologi <strong>Row Level Security (RLS)</strong> tingkat lanjut.
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm">
              Grafik dan angka di halaman ini digenerate secara otomatis melalui fungsi agregasi <em>database</em> (K-Anonymity). 
              Sistem menjamin bahwa tidak ada satupun data Nomor Induk Kependudukan (NIK) atau rincian identitas individu yang 
              terkirim ke jaringan publik.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}