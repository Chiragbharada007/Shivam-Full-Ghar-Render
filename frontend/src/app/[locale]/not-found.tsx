// src/app/[locale]/not-found.tsx
import Link from "next/link";
import { Flower2, Home, Search, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-white transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
          <Flower2 className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-serif font-black text-rose-600 dark:text-rose-400">
            404
          </span>
          <h1 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
            પૃષ્ઠ મળ્યું નથી • Page Not Found
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            તમે જે પૃષ્ઠ શોધી રહ્યા છો તે અસ્તિત્વમાં નથી અથવા ખસેડવામાં આવ્યું છે.
            અમારા તાજા ફૂલો અને વરમાળા સંગ્રહમાંથી પસંદગી કરો.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/gu"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-950 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>મુખ્ય પૃષ્ઠ (Home)</span>
          </Link>

          <Link
            href="/gu/shop"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>દુકાન (Collections)</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
          <span>સહાય માટે વોટ્સએપ કરો: </span>
          <a
            href="https://wa.me/919824132014"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 ml-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>+91 98241 32014</span>
          </a>
        </div>
      </div>
    </div>
  );
}
