import { createClient } from "../../utils/supabase/server";
import { Download, FileText, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Dokumen | Pemdes Gubugklakah",
  description: "Unduh dokumen resmi, formulir, dan laporan Pemerintah Desa Gubugklakah.",
};

interface DokumenItem {
  id: string;
  kategori: string;
  judul: string;
  file_url: string;
  tahun: string | null;
}

export default async function DokumenPublik() {
  const supabase = await createClient();

  // Ambil data dokumen yang dipublikasikan
  const { data: documents } = await supabase
    .from("dokumen")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const groupedDocuments = (documents || []).reduce((acc: Record<string, DokumenItem[]>, doc) => {
    const item = doc as DokumenItem;
    const category = item.kategori;
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    
    return acc;
  }, {});

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Header Flat Design */}
      <section className="bg-primary-900 text-white py-16 border-b-8 border-accent-500 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Pusat Dokumen</h1>
          <p className="text-xl text-primary-100">
            Arsip digital dokumen resmi dan formulir Desa Gubugklakah
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kotak Pencarian Dummy (UI saja untuk MVP) */}
        <div className="bg-white p-4 rounded-lg border-2 border-neutral-200 flex items-center gap-3 mb-10">
          <Search className="text-neutral-400" />
          <input 
            type="text" 
            placeholder="Cari nama dokumen..." 
            className="w-full focus:outline-none text-neutral-700 bg-transparent"
            disabled 
          />
        </div>

        {/* Daftar Dokumen per Kategori */}
        {Object.keys(groupedDocuments).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedDocuments).map(([kategori, docs]) => (
              <div key={kategori}>
                <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6 border-b-4 border-primary-500 inline-block pb-2">
                  {kategori}
                </h2>
                
                <div className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="hidden md:table-header-group bg-neutral-50 border-b-2 border-neutral-200">
                      <tr className="text-neutral-600 text-sm uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold w-2/3">Nama Dokumen</th>
                        <th className="px-6 py-4 font-bold text-center">Tahun</th>
                        <th className="px-6 py-4 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-neutral-700">
                      {docs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-primary-50 transition-colors flex flex-col md:table-row">
                          <td className="px-6 py-4 flex items-start gap-3">
                            <FileText className="text-primary-500 shrink-0 mt-1" size={20} />
                            <div>
                              <p className="font-bold text-neutral-900">{doc.judul}</p>
                            </div>
                          </td>
                          <td className="px-6 py-2 md:py-4 md:text-center text-sm font-mono text-neutral-500">
                            <span className="md:hidden font-bold mr-2">Tahun:</span>
                            {doc.tahun || "-"}
                          </td>
                          <td className="px-6 py-4 md:text-right">
                            <a 
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 bg-primary-100 hover:bg-primary-200 text-primary-800 font-bold py-2 px-4 rounded-md transition-colors w-full md:w-auto"
                            >
                              <Download size={16} /> Unduh
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border-2 border-dashed border-neutral-300 rounded-lg">
            <p className="text-neutral-500 font-medium">Belum ada dokumen yang dipublikasikan.</p>
          </div>
        )}

      </div>
    </div>
  );
}