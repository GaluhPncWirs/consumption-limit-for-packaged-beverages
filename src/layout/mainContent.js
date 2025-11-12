import Image from "next/image";
import Link from "next/link";

export default function MainContentLayout({ children }) {
  return (
    <div className="flex">
      <div className="md:w-1/4 lg:w-1/5 bg-green-400 h-screen">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-3/5 bg-cover bg-center max-[640px]:w-1/3 sm:w-5/6 md:w-3/5 lg:w-1/2"
            loading="lazy"
          />
          <ul>
            <li>
              <Link
                href="/mainContent/about"
                className="hover:text-red-500 flex items-center justify-center gap-2"
              >
                Tentang
              </Link>
            </li>
            <li>
              <Link
                href="/mainContent/addProduct"
                className="hover:text-red-500 flex items-center justify-center gap-2"
              >
                Tambah Produk
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-11/12 mx-auto md:w-2/3 lg:w-3/4 my-10">{children}</div>
    </div>
  );
}
