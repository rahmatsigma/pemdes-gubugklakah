// Path: src/middleware.ts
// Dibuat baru

import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Hanya jalankan middleware ini pada route yang dibutuhkan (agar website tetap cepat)
export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua request KECUALI untuk:
     * - _next/static (file statis CSS/JS Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (ikon web)
     * - gambar/aset di folder public (.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};