// Path: src/app/admin/penduduk/ImportPenduduk.tsx
// Dibuat baru - Tombol dan Modal Dialog untuk Import File

"use client";

import { useState } from "react";
import { Upload, X, FileUp, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { importDataPenduduk } from "../actions";

export default function ImportPenduduk() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // State untuk laporan hasil import
  const [report, setReport] = useState<{
    success: boolean;
    message?: string;
    data?: { total: number; successCount: number; failedCount: number; errors: string[] };
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null); // Reset report jika pilih file baru
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await importDataPenduduk(formData);
    
    if (!result.success) {
      setReport({ success: false, message: result.message });
    } else {
      setReport({ success: true, data: result.report });
      setFile(null); // Kosongkan file jika berhasil
    }
    
    setIsUploading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    setReport(null);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm"
      >
        <Upload size={16} /> Import
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="bg-white rounded-lg w-full max-w-lg relative z-10 border-2 border-neutral-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-4 border-b-2 border-neutral-100 bg-neutral-50">
              <h3 className="font-heading font-bold text-lg text-neutral-900">Import Data Penduduk</h3>
              <button onClick={closeModal} className="text-neutral-500 hover:bg-neutral-200 p-1 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              {!report ? (
                <>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-md border-2 border-blue-200 mb-6 text-sm font-medium">
                    Pastikan file Anda berformat <strong>.xlsx</strong> atau <strong>.csv</strong> dan memiliki kolom *header* baris pertama yang sesuai persis dengan nama field di sistem (nik, no_kk, nama_lengkap, dst). Tanggal lahir harus berformat YYYY-MM-DD.
                  </div>

                  <div className="border-2 border-dashed border-neutral-300 rounded-md p-8 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors relative cursor-pointer">
                    <FileUp className="text-neutral-400 mb-3" size={32} />
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="bg-neutral-800 text-white font-bold py-2 px-4 rounded-md text-sm pointer-events-none">
                      Pilih File Excel/CSV
                    </span>
                    <p className="text-xs text-neutral-500 mt-3 font-medium pointer-events-none">
                      {file ? <span className="text-primary-600 font-bold">{file.name}</span> : "Maksimal 2.000 baris data."}
                    </p>
                  </div>
                </>
              ) : (
                /* Laporan Hasil Import */
                <div className="space-y-4">
                  {report.success ? (
                    <div className="text-center pb-4">
                      <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                      <h4 className="font-bold text-xl text-neutral-900 mb-2">Import Selesai!</h4>
                      <div className="bg-neutral-50 border-2 border-neutral-200 rounded-md p-4 grid grid-cols-3 gap-2 text-center mt-4">
                        <div>
                          <p className="text-xs font-bold text-neutral-500 uppercase">Total</p>
                          <p className="text-xl font-bold text-neutral-900">{report.data?.total}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-500 uppercase">Berhasil</p>
                          <p className="text-xl font-bold text-green-600">{report.data?.successCount}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-500 uppercase">Gagal</p>
                          <p className="text-xl font-bold text-red-600">{report.data?.failedCount}</p>
                        </div>
                      </div>
                      
                      {report.data!.failedCount > 0 && (
                        <div className="mt-6 text-left bg-red-50 p-4 rounded-md border border-red-200 text-sm">
                          <p className="font-bold text-red-800 mb-2">Log Error (Menampilkan max 10):</p>
                          <ul className="list-disc pl-4 text-red-700 space-y-1">
                            {report.data?.errors.map((err, i) => <li key={i}>{err}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center pb-4">
                      <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                      <h4 className="font-bold text-xl text-neutral-900 mb-2">Import Gagal</h4>
                      <p className="text-neutral-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{report.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t-2 border-neutral-100 bg-neutral-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeModal}
                disabled={isUploading}
                className="px-4 py-2 font-bold text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors disabled:opacity-50"
              >
                {report?.success ? "Tutup" : "Batal"}
              </button>
              {!report?.success && (
                <button 
                  onClick={handleImport}
                  disabled={!file || isUploading}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
                  {isUploading ? "Memproses..." : "Mulai Import"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}