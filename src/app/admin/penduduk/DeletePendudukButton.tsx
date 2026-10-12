"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeletePendudukButton({ id, nama }: { id: string, nama: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`PERINGATAN: Yakin ingin menghapus data penduduk "${nama}"?\nTindakan ini tidak dapat dibatalkan.`);
    
    if (confirmDelete) {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from("penduduk")
        .delete()
        .eq("id", id);
        
      if (error) {
        alert("Gagal menghapus data: " + error.message);
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
      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Hapus"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}