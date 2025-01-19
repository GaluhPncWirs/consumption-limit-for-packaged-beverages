import Image from "next/image";
import Link from "next/link";
import ButtonBack from "../buttonBack/btn";
import { usePathname } from "next/navigation";

export default function NavigasiBar({ props }) {
  const path = usePathname();
  return (
    <div className="w-full h-16 bg-green-400 shadow-md shadow-slate-500 fixed top-0">
      <div className="flex h-full">
        <div className="basis-1/5 bg-green-300 rounded-r-lg flex justify-center items-center">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-3/5 bg-cover bg-center"
          />
        </div>
        <div className="basis-4/5">
          <ul className="flex justify-around items-center h-full font-semibold text-lg">
            <li>Tentang</li>
            <li>
              <Link href={"./addProduct"}>add Produk</Link>
            </li>
            <ButtonBack path={path} props={props} />
          </ul>
        </div>
      </div>
    </div>
  );
}
