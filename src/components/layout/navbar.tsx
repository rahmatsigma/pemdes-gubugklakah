"use client"; 

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil Desa", href: "/profil" },
    { name: "Pemerintahan", href: "/pemerintahan" },
    { name: "Layanan", href: "/layanan" },
    { name: "Berita", href: "/berita" },
    { name: "Dokumen", href: "/dokumen" },
  ];

  return (
    <nav className="bg-primary-600 text-white border-b-4 border-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 font-heading font-bold text-xl tracking-wide">
            <Link href="/">PEMDES GUBUGKLAKAH</Link>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-primary-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary-700 border-t-2 border-primary-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md font-medium hover:bg-primary-800 transition-colors"
                onClick={() => setIsOpen(false)} 
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}