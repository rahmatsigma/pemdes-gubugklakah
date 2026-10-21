// Path: src/app/admin/umkm/page.tsx
// Dibuat baru - Menampilkan daftar UMKM dengan Pagination

import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Plus, Search, Store, MapPin, Phone } from "lucide-react";
import Badge from "../../../components/ui/badge";
import Pagination from "../../../components/ui/Pagination";
import DeleteUmkmButton from "./DeleteUmkmButton";

export default async function AdminUmkm(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  
  const supabase = await createClient();
  const offset = (currentPage - 1) * itemsPerPage;

  let queryBuilder = supabase.from("umkm_pelaku").select("*", { count: "exact" });

  if (query) {
    queryBuilder = queryBuilder.ilike("nama_usaha", `%${query}%`);
  }

  const { data: umkm, count } = await queryBuilder
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Kelola Lapak UMKM</h1>
          <p className="text-neutral-600">Daftar pelaku usaha dan produk unggulan desa.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Link href="/admin/umkm/tambah" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm">
            <Plus size={16} /> Tambah Lapak UMKM
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-neutral-200 mb-6 flex items-center justify-between shadow-sm">
        <form action="/admin/umkm" method="GET" className="flex w-full max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input type="text" name="query" defaultValue={query} placeholder="Cari Nama Usaha..." className="bg-neutral-50 border-2 border-neutral-200 text-neutral-900 text-sm rounded-l-md focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 outline-none font-medium" />
          </div>
          <button type="submit" className="bg-primary-100 text-primary-800 border-2 border-l-0 border-primary-200 hover:bg-primary-200 font-bold rounded-r-md px-4 text-sm transition-colors">Cari</button>
        </form>
        <div className="hidden sm:block text-sm font-bold text-neutral-500">
          Total: <span className="text-neutral-900">{count || 0} Lapak</span>
        </div>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-xs uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-4 py-4 font-bold">Nama Usaha / Pemilik</th>
                <th className="px-4 py-4 font-bold">Kategori</th>
                <th className="px-4 py-4 font-bold">Kontak & Lokasi</th>
                <th className="px-4 py-4 font-bold text-center">Status</th>
                <th className="px-4 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700 text-sm">
              {umkm && umkm.length > 0 ? (
                umkm.map((item) => (
                  <tr key={item.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-neutral-900 text-base">{item.nama_usaha}</p>
                      <p className="text-xs font-medium text-neutral-500">Pemilik: {item.nama_pemilik}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-neutral-600 bg-neutral-100 px-2 py-1 rounded-sm border border-neutral-200 text-xs uppercase tracking-wider">
                        {item.kategori_usaha}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                          <Phone size={12} className={item.izin_publikasi_kontak ? "text-green-600" : "text-red-500"} />
                          {item.nomor_wa} {item.izin_publikasi_kontak ? "" : "(Privasi)"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <MapPin size={12} /> {item.alamat_usaha}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={item.status_aktif ? "success" : "danger"}>
                        {item.status_aktif ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/umkm/produk?umkm_id=${item.id}`} className="text-accent-600 hover:text-accent-800 font-bold text-xs bg-accent-50 px-2 py-1 rounded border border-accent-200 transition-colors">
                          Lihat Produk
                        </Link>
                        <span className="text-neutral-300">|</span>
                        <Link href={`/admin/umkm/edit/${item.id}`} className="text-primary-600 hover:text-primary-800 font-medium text-xs hover:underline">
                          Edit
                        </Link>
                        <span className="text-neutral-300">|</span>
                        <DeleteUmkmButton id={item.id} nama={item.nama_usaha} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <Store size={48} className="mx-auto mb-3 text-neutral-300" />
                    {query ? "Tidak ada UMKM yang cocok dengan pencarian." : "Belum ada data UMKM."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}