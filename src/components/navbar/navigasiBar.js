import Image from "next/image";
import Link from "next/link";

export default function NavigasiBar({ props }) {
  return (
    <div className="w-full h-16 bg-green-400">
      <div className="flex h-full">
        <div className="basis-1/5 bg-green-500 rounded-r-lg">
          <Image src="" alt="" />
          buat gambar
        </div>
        <div className="basis-4/5">
          <ul className="flex justify-around items-center h-full font-semibold text-lg">
            <li>Tentang</li>
            <li>
              <Link href={"./addProduct"}>add Produk</Link>
            </li>
            <li className="px-2 py-1.5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-1 cursor-pointer">
              <button
                className="text-xl font-semibold"
                type="button"
                onClick={props}
              >
                Kembali
              </button>
              <Image
                src="/images/arrow_left.png"
                alt="arrow_left"
                className="w-1/5"
                width={200}
                height={200}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
