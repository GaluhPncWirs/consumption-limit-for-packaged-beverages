import Link from "next/link";
import ButtonBack from "../button/content";
import Image from "next/image";

export default function PathNavbar({ path }) {
  return (
    <div>
      <div className="flex flex-col items-center mt-10 mx-5">
        <Image
          src="/images/global/logo.png"
          alt="logo"
          width={300}
          height={300}
          className="bg-[#f9fff9] rounded-lg p-3 shadow-lg shadow-slate-600 w-48 lg:w-56"
        />
        <div className="mt-10 flex flex-col font-semibold gap-y-10 text-xl lg:text-2xl">
          <Link href="/mainContent/calculate" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                path === "/mainContent/calculate"
                  ? `calculate-full`
                  : `calculate`
              }.png`}
              alt="beranda"
              width={200}
              height={200}
              className="size-8 mb-2"
            />
            <span>Hitung </span>
          </Link>

          <Link href="/mainContent/addProduct" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                path === "/mainContent/addProduct"
                  ? `addProduct-full`
                  : `addProduct`
              }.png`}
              alt="tambah produk"
              width={200}
              height={200}
              className="size-8 mb-2"
            />
            <span>Tambah Produk</span>
          </Link>
          <Link href="/mainContent/about" className="hover:text-slate-600">
            <Image
              src={`/images/global/${
                path === "/mainContent/about" ? `aboutMe-full` : `aboutMe`
              }.png`}
              alt="About"
              width={200}
              height={200}
              className="size-10 mb-1"
            />
            <span>Tentang</span>
          </Link>
          <ButtonBack path={path} />
        </div>
      </div>
    </div>
  );
}
