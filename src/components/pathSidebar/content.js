import Link from "next/link";
import ButtonBack from "../button/content";
import Image from "next/image";
import { useLocationPage } from "@/app/stateManagement/pathname/state";

export default function PathNavbar() {
  const curentLocation = useLocationPage((state) => state.curentLocationPage);
  return (
    <div>
      <div className="flex flex-col items-center mt-10 mx-5">
        <Image
          src="/images/global/logo.png"
          alt="logo"
          width={400}
          height={400}
          className="bg-[#f9fff9] rounded-lg p-3 shadow-lg shadow-slate-600 w-48 lg:w-56"
          loading="eager"
        />
        <div className="mt-10 flex flex-col font-semibold gap-y-10 text-xl lg:text-2xl">
          <Link href="/mainContent/calculate" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                curentLocation === "/mainContent/calculate"
                  ? `calculate-full`
                  : `calculate`
              }.png`}
              alt="beranda"
              width={200}
              height={200}
              className="size-8 mb-2"
              loading="eager"
            />
            <span>Hitung </span>
          </Link>

          <Link href="/mainContent/addProduct" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                curentLocation === "/mainContent/addProduct"
                  ? `addProduct-full`
                  : `addProduct`
              }.png`}
              alt="tambah produk"
              width={200}
              height={200}
              className="size-8 mb-2"
              loading="eager"
            />
            <span>Tambah Produk</span>
          </Link>
          <Link href="/mainContent/about" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                curentLocation === "/mainContent/about"
                  ? `aboutMe-full`
                  : `aboutMe`
              }.png`}
              alt="About"
              width={200}
              height={200}
              className="size-10 mb-1"
              loading="eager"
            />
            <span>Tentang</span>
          </Link>
          <ButtonBack curentLocation={curentLocation} />
        </div>
      </div>
    </div>
  );
}
