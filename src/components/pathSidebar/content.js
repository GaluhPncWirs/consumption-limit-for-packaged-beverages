import Link from "next/link";
import Image from "next/image";
import { useLocationPage } from "@/store/usePathname/state";
import ButtonBack from "../button/content";

export default function PathNavbar() {
  const curentLocation = useLocationPage((state) => state.curentLocationPage);
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
              curentLocation === "/mainContent/calculateBeverage"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                curentLocation === "/mainContent/calculateBeverage"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <Image
                src={`/images/global/${
                  curentLocation === "/mainContent/calculateBeverage"
                    ? "calculate-full"
                    : "calculate"
                }.png`}
                alt=""
                width={200}
                height={200}
                className="size-6"
                loading="eager"
              />
            </div>

            <span className="text-sm font-semibold">Hitung</span>
          </Link>

          {/* Tambah Produk */}
          <Link
            href="/mainContent/addProduct"
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              curentLocation === "/mainContent/addProduct"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                curentLocation === "/mainContent/addProduct"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <Image
                src={`/images/global/${
                  curentLocation === "/mainContent/addProduct"
                    ? "addProduct-full"
                    : "addProduct"
                }.png`}
                alt=""
                width={200}
                height={200}
                className="size-6"
                loading="eager"
              />
            </div>

            <span className="text-sm font-semibold">Tambah Produk</span>
          </Link>

          {/* Tentang */}
          <Link
            href="/mainContent/about"
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              curentLocation === "/mainContent/about"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-emerald-950 hover:bg-white/20"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                curentLocation === "/mainContent/about"
                  ? "bg-emerald-100"
                  : "bg-white/10 group-hover:bg-white/20"
              }`}
            >
              <Image
                src={`/images/global/${
                  curentLocation === "/mainContent/about"
                    ? "aboutMe-full"
                    : "aboutMe"
                }.png`}
                alt=""
                width={200}
                height={200}
                className="size-6"
                loading="eager"
              />
            </div>

            <span className="text-sm font-semibold">Tentang</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Action */}
      <div className="border-t border-slate-100 p-4">
        <ButtonBack />
      </div>
    </>
  );
}
