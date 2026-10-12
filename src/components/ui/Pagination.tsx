
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Jika halaman hanya 1, sembunyikan navigasi
  if (totalPages <= 1) return null;

  // Fungsi untuk membuat URL baru saat tombol ditekan
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Tombol Sebelumnya */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-md border-2 ${
          currentPage <= 1
            ? "border-neutral-200 text-neutral-400 pointer-events-none"
            : "border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft size={20} />
      </Link>

      {/* Info Halaman Aktif */}
      <div className="flex items-center justify-center h-10 px-4 border-2 border-neutral-900 rounded-md bg-neutral-900 text-white font-bold text-sm">
        Halaman {currentPage} dari {totalPages}
      </div>

      {/* Tombol Selanjutnya */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-md border-2 ${
          currentPage >= totalPages
            ? "border-neutral-200 text-neutral-400 pointer-events-none"
            : "border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}