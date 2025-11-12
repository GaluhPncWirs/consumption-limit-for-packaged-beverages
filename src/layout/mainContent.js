import Image from "next/image";
import Link from "next/link";

export default function MainContentLayout({ children }) {
  return (
    <div className="flex">
      <div className="md:w-1/4 lg:w-1/5">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed">
          <div className="flex flex-col items-center mt-5">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={300}
              height={300}
              className="max-[640px]:w-1/3 sm:w-1/2"
              loading="lazy"
            />
            <div className="mt-5 flex flex-col items-center text-xl font-semibold gap-y-10">
              <Link href="/mainContent/about" className="hover:text-red-500">
                Tentang
              </Link>
              <Link
                href="/mainContent/addProduct"
                className="hover:text-red-500"
              >
                Tambah Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-11/12 md:w-2/3 lg:w-3/4 mx-auto">{children}</div>
    </div>
  );
}
