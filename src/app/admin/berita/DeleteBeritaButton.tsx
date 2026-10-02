// Path: src/app/admin/berita/DeleteBeritaButton.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteBeritaButton({ id, title }: { id: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    // Konfirmasi dari browser (standar flat design: fungsionalitas native)
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`);
    
    if (confirmDelete) {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
        
      if (error) {
        alert("Gagal menghapus berita: " + error.message);
        setIsDeleting(false);
      } else {
        // Refresh halaman agar data terbaru ter-load
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