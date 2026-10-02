"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Memanggil klien Supabase untuk browser
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Proses login ke Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau kata sandi salah.");
      setLoading(false);
    } else {
      router.refresh();
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-neutral-200 rounded-lg p-8 shadow-sm">
        
        {/* Header Login */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
            Panel Admin
          </h1>
          <p className="text-neutral-500">Pemdes Gubugklakah</p>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-2 border-neutral-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-0"
                placeholder="admin@gubugklakah.desa.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-2 border-neutral-200 rounded-md focus:outline-none focus:border-primary-500 focus:ring-0"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-primary-300"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Masuk"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium text-primary-600 hover:text-primary-800">
            &larr; Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}