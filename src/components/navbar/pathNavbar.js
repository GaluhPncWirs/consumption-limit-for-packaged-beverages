import Link from "next/link";
import ButtonBack from "../button/btnBack";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PathNavbar({ path }) {
  const [pathConditions, setPathConditions] = useState({
    path: "",
    textNavbar: "",
  });

  useEffect(() => {
    if (path === "/mainContent/addProduct") {
      setPathConditions((prev) => ({
        ...prev,
        path: "/mainContent/about",
        textNavbar: "Tentang",
      }));
    } else {
      setPathConditions((prev) => ({
        ...prev,
        path: "/mainContent/addProduct",
        textNavbar: "Tambah Produk",
      }));
    }
  }, [path]);
  return (
    <div>
      <div className="flex flex-col items-center mt-10">
        <Image
          src="/images/global/logo.png"
          alt="logo"
          width={300}
          height={300}
          className="w-60 bg-[#f9fff9] rounded-lg p-3 shadow-lg shadow-slate-600 max-[640px]:w-48"
        />
        <div className="mt-10 flex flex-col text-2xl font-semibold gap-y-10">
          {path === "/mainContent/calculate" ? (
            <>
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
              <ButtonBack path={path} />
            </>
          ) : (
            <>
              <Link
                href={pathConditions.path}
                className="hover:text-slate-600 flex items-center justify-center gap-x-2"
              >
                {pathConditions.textNavbar}
              </Link>
              <ButtonBack path={path} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
