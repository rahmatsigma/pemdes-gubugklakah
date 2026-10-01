// Path: src/app/admin/layout.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, Users, LogOut, Menu, X, Settings } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
    { name: "Perangkat Desa", href: "/admin/perangkat", icon: Users },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* 
        SIDEBAR DESKTOP
        Flat design: Border kanan tegas, bg putih solid 
      */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-neutral-200">
        <div className="p-6 border-b-2 border-neutral-200 bg-primary-600">
          <h2 className="font-heading font-bold text-lg text-white">Panel Admin</h2>
          <p className="text-primary-100 text-sm">Desa Gubugklakah</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Cek apakah menu sedang aktif
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive 
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500" 
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t-2 border-neutral-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar Mobile (Hanya muncul di HP) */}
        <header className="md:hidden bg-primary-600 text-white p-4 flex justify-between items-center border-b-4 border-primary-900">
          <span className="font-heading font-bold">Admin Gubugklakah</span>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Area Render Anak (Halaman-halaman admin) */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* OVERLAY & SIDEBAR MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Latar gelap transparan */}
          <div 
            className="fixed inset-0 bg-neutral-900/50" 
            onClick={() => setIsSidebarOpen(false)}
          />
          
          <aside className="relative w-64 bg-white h-full flex flex-col border-r-2 border-neutral-200 z-50">
            <div className="p-4 flex justify-between items-center bg-primary-600 text-white">
              <span className="font-heading font-bold">Menu Admin</span>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${
                      isActive 
                        ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500" 
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t-2 border-neutral-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 font-medium hover:bg-red-50 rounded-md"
              >
                <LogOut size={20} /> Keluar
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}