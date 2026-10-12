"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Newspaper, Users, LogOut, Menu, X, 
  Settings, FileText, Mail, MessageSquareWarning, AlertTriangle,
  IdCard 
} from "lucide-react"; 
import { createClient } from "../../utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsSidebarOpen(false);
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Data Penduduk", href: "/admin/penduduk", icon: IdCard },
    { name: "Kelola Surat", href: "/admin/surat", icon: Mail },
    { name: "Pengaduan Warga", href: "/admin/pengaduan", icon: MessageSquareWarning }, 
    { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
    { name: "Perangkat Desa", href: "/admin/perangkat", icon: Users },
    { name: "Kelola Dokumen", href: "/admin/dokumen", icon: FileText },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-neutral-200">
        <div className="p-6 border-b-2 border-neutral-200 bg-primary-600">
          <h2 className="font-heading font-bold text-lg text-white">Panel Admin</h2>
          <p className="text-primary-100 text-sm">Desa Gubugklakah</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
            
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
        
        <div className="p-4 border-t-2 border-neutral-200 mt-auto">
          <button onClick={handleLogoutClick} className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 font-bold hover:bg-red-50 rounded-md transition-colors">
            <LogOut size={20} className="text-red-600" /> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-primary-600 text-white p-4 flex justify-between items-center border-b-4 border-primary-900">
          <span className="font-heading font-bold">Admin Gubugklakah</span>
          <button onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
        </header>
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</div>
      </main>

      {/* OVERLAY & SIDEBAR MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col border-r-2 border-neutral-200 z-50">
            <div className="p-4 flex justify-between items-center bg-primary-600 text-white">
              <span className="font-heading font-bold">Menu Admin</span>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${isActive ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}`}>
                    <Icon size={20} /> {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t-2 border-neutral-200 mt-auto">
              <button onClick={handleLogoutClick} className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 font-bold hover:bg-red-50 rounded-md">
                <LogOut size={20} className="text-red-600" /> Keluar
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative z-10 border-2 border-neutral-200 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4"><AlertTriangle size={32} /></div>
              <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2">Konfirmasi Keluar</h3>
              <p className="text-neutral-600 text-sm mb-6">Apakah Anda yakin ingin keluar dari Panel Admin?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-2.5 rounded-md transition-colors">Batal</button>
                <button onClick={confirmLogout} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-md transition-colors">Ya, Keluar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}