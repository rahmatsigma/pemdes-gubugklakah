// Path: src/app/layout.tsx
// Diedit

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';

// Konfigurasi Font
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Metadata Dasar (SEO)
export const metadata: Metadata = {
  title: 'Pemdes Gubugklakah',
  description: 'Website Resmi Pemerintah Desa Gubugklakah, Pusat Informasi dan Layanan Publik.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      {/* 
        Kita tambahkan flex dan min-h-screen di body 
        agar footer selalu berada di posisi paling bawah layar
      */}
      <body className="font-sans bg-neutral-50 text-neutral-900 antialiased selection:bg-primary-500 selection:text-white flex flex-col min-h-screen">
        <Navbar />
        {/* main menggunakan flex-grow agar mengisi sisa ruang kosong di tengah */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}