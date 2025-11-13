import Image from "next/image";
import Link from "next/link";

export default function MainContentLayout({ children }) {
  return (
    <div className="flex">
      <div className="w-1/4">
        <div className="bg-green-400 h-screen shadow-lg shadow-slate-700 fixed w-1/4">
          <div className="flex flex-col items-center mt-10">
            <Image
              src="/images/global/logo.png"
              alt="logo"
              width={300}
              height={300}
              className="w-60 bg-[#f9fff9] rounded-lg p-3"
            />

            <div className="mt-14 flex flex-col text-2xl font-semibold gap-y-10">
              <Link href="/mainContent/about" className="hover:text-slate-600">
                <Image
                  src="/images/global/aboutMe.png"
                  alt="About"
                  width={200}
                  height={200}
                  className="size-10 mb-1"
                />
                <span>Tentang</span>
              </Link>
              <Link
                href="/mainContent/addProduct"
                className="hover:text-slate-600"
              >
                <Image
                  src="/images/global/addProduct.png"
                  alt="About"
                  width={200}
                  height={200}
                  className="size-8 mb-2"
                />
                Tambah Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-11/12 md:w-2/3 mx-auto">{children}</div>
    </div>
  );
}
