// Path: src/app/admin/dokumen/DeleteDokumenButton.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteDokumenButton({ id, judul }: { id: string, judul: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus dokumen "${judul}"?`);
    
    if (confirmDelete) {
      setIsDeleting(true);
      
      // Untuk MVP kita hapus datanya dari tabel dokumen
      // (Bisa dikembangkan untuk menghapus file fisik di storage.buckets juga)
      const { error } = await supabase
        .from("dokumen")
        .delete()
        .eq("id", id);
        
      if (error) {
        alert("Gagal menghapus dokumen: " + error.message);
        setIsDeleting(false);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Hapus"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}