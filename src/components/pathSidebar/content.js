import Link from "next/link";
import Image from "next/image";
import ButtonBack from "../button/content";
import { Calculator, PackagePlus, User2 } from "lucide-react";

export default function PathNavbar({ pathName }) {
  return (
    <>
      {/* Logo */}
      <div className="px-6 pt-8">
        <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-md">
          <Image
            src="/images/global/logo.png"
            alt="Nutrigood"
            width={400}
            height={400}
            className="h-auto w-40 xl:w-44"
            loading="eager"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex-1 px-4">
        <p className="mb-3 px-3 text-sm font-bold uppercase tracking-widest text-emerald-950">
          Menu
        </p>

        <div className="space-y-2">
          {/* Hitung */}
          <Link
            href="/mainContent/calculateBeverage"
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              pathName === "/mainContent/calculateBeverage"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                pathName === "/mainContent/calculateBeverage"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <Calculator className="size-6" />
            </div>

            <span className="text-sm font-semibold">Hitung</span>
          </Link>

          {/* Tambah Produk */}
          <Link
            href="/mainContent/addProduct"
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              pathName === "/mainContent/addProduct"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                pathName === "/mainContent/addProduct"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <PackagePlus className="size-6" />
            </div>

            <span className="text-sm font-semibold">Tambah Produk</span>
          </Link>

          {/* Tentang */}
          <Link
            href="/mainContent/about"
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              pathName === "/mainContent/about"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                pathName === "/mainContent/about"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <User2 className="size-6" />
            </div>

            <span className="text-sm font-semibold">Tentang</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Action */}
      <div className="border-t border-slate-100 p-4">
        <ButtonBack pathName={pathName} />
      </div>
    </>
  );
}
