
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-100 border-t-4 border-accent-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1: Info Desa */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4 text-accent-500">
              Desa Gubugklakah
            </h3>
            <p className="text-neutral-400">
              Kecamatan Poncokusumo, Kabupaten Malang, Jawa Timur. <br />
              Portal informasi resmi dan pelayanan publik desa.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/profil" className="hover:text-accent-400 transition-colors">Profil Desa</Link></li>
              <li><Link href="/pemerintahan" className="hover:text-accent-400 transition-colors">Pemerintahan</Link></li>
              <li><Link href="/berita" className="hover:text-accent-400 transition-colors">Berita & Pengumuman</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-neutral-400">
              <li>Email: pemdes@gubugklakah.desa.id</li>
              <li>Telepon: (0341) 123456</li>
              <li>Jam Kerja: Sen - Jum (08:00 - 15:00)</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} Pemerintah Desa Gubugklakah. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}