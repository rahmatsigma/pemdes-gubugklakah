import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { Plus, Search, Users, Download, Upload } from "lucide-react";
import Badge from "../../../components/ui/badge";
import Pagination from "../../../components/ui/Pagination";
import DeletePendudukButton from "./DeletePendudukButton";
import ImportPenduduk from "./tambah/ImportPenduduk";

export default async function AdminPenduduk(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  
  const supabase = await createClient();
  const offset = (currentPage - 1) * itemsPerPage;

  let queryBuilder = supabase.from("penduduk").select("*", { count: "exact" });

  if (query) {
    queryBuilder = queryBuilder.or(`nama_lengkap.ilike.%${query}%,nik.ilike.%${query}%`);
  }

  const { data: penduduk, count } = await queryBuilder
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  const getStatusVariant = (status: string) => {
    if (status === "Meninggal") return "danger";
    if (status === "Pindah") return "warning";
    return "success"; 
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Buku Induk Penduduk</h1>
          <p className="text-neutral-600">Kelola data kependudukan, KK, dan mutasi warga Gubugklakah.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <ImportPenduduk />
          <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-2 border-neutral-300 font-bold py-2.5 px-4 rounded-md transition-colors text-sm">
            <Download size={16} /> Export
          </button>
          <Link href="/admin/penduduk/tambah" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm">
            <Plus size={16} /> Tambah Data
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-neutral-200 mb-6 flex items-center justify-between shadow-sm">
        <form action="/admin/penduduk" method="GET" className="flex w-full max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input type="text" name="query" defaultValue={query} placeholder="Cari NIK atau Nama Lengkap..." className="bg-neutral-50 border-2 border-neutral-200 text-neutral-900 text-sm rounded-l-md focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 outline-none font-medium" />
          </div>
          <button type="submit" className="bg-primary-100 text-primary-800 border-2 border-l-0 border-primary-200 hover:bg-primary-200 font-bold rounded-r-md px-4 text-sm transition-colors">Cari</button>
        </form>
        <div className="hidden sm:block text-sm font-bold text-neutral-500">
          Total: <span className="text-neutral-900">{count || 0} Jiwa</span>
        </div>
      </div>

      <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 text-xs uppercase tracking-wider border-b-2 border-neutral-200">
                <th className="px-4 py-4 font-bold">NIK / Nama Lengkap</th>
                <th className="px-4 py-4 font-bold">L/P</th>
                <th className="px-4 py-4 font-bold">RT / RW</th> {/* HANYA RT/RW SEKARANG */}
                <th className="px-4 py-4 font-bold">Pekerjaan</th>
                <th className="px-4 py-4 font-bold text-center">Status</th>
                <th className="px-4 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700 text-sm">
              {penduduk && penduduk.length > 0 ? (
                penduduk.map((p) => (
                  <tr key={p.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-neutral-900 leading-tight">{p.nama_lengkap}</p>
                      <p className="text-xs font-mono text-neutral-500">{p.nik}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {p.jenis_kelamin === "Laki-laki" ? "L" : "P"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-sm border border-neutral-200">
                        {p.rt} / {p.rw}
                      </span>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={p.pekerjaan}>{p.pekerjaan}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getStatusVariant(p.status_penduduk)}>{p.status_penduduk}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/penduduk/edit/${p.id}`} className="text-primary-600 hover:text-primary-800 font-medium text-xs hover:underline">Edit</Link>
                        <span className="text-neutral-300">|</span>
                        <DeletePendudukButton id={p.id} nama={p.nama_lengkap} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    <Users size={48} className="mx-auto mb-3 text-neutral-300" />
                    {query ? "Tidak ada penduduk yang cocok dengan pencarian." : "Belum ada data penduduk."}
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