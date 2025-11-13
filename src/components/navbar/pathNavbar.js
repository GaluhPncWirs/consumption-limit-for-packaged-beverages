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
    <>
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
          <Link href="/mainContent/addProduct" className="hover:text-slate-600">
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
            className="hover:text-slate-600 flex items-center justify-center gap-2"
          >
            {pathConditions.textNavbar}
          </Link>
          <ButtonBack path={path} />
        </>
      )}
    </>
  );
}
