// src/app/not-found.tsx
import Link from "next/link";
import { Flower2, Home } from "lucide-react";

export default function RootNotFound() {
  return (
    <html lang="gu">
      <body className="min-h-screen flex items-center justify-center p-4 bg-[#faf9f6] text-stone-900 font-sans">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white border border-stone-200 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Flower2 className="w-8 h-8" />
          </div>
          <span className="text-4xl font-serif font-black text-rose-600 block">404</span>
          <h1 className="text-xl font-serif font-bold text-stone-900">
            પૃષ્ઠ મળ્યું નથી • Page Not Found
          </h1>
          <p className="text-xs text-stone-600">
            શિવમ ફૂલ ઘર ભાટ સિમરોલી • Shivam Full Ghar Bhat Simroli
          </p>
          <div className="pt-2">
            <Link
              href="/gu"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>મુખ્ય પૃષ્ઠ (Go to Home)</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
