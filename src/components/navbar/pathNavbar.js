import Link from "next/link";
import ButtonBack from "../button/btnBack";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PathNavbar({ props, path }) {
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
          <li>
            <Link
              href={"/mainContent/about"}
              className="hover:text-red-500 flex items-center justify-center gap-2"
            >
              <Image
                src={"/images/about.png"}
                alt="About"
                height={50}
                width={50}
                className="w-1/5"
              />
              <span>Tentang</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/mainContent/addProduct"}
              className="hover:text-red-500 flex items-center justify-center gap-2"
            >
              <Image
                src={"/images/tambah-produk.png"}
                alt="Tambah Produk"
                height={50}
                width={50}
                className="w-1/6"
              />
              <span>Tambah Produk</span>
            </Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      ) : (
        <>
          <li>
            <Link
              href={pathConditions.path}
              className="hover:text-red-500 flex items-center justify-center gap-2"
            >
              {pathConditions.textNavbar === "Tentang" ? (
                <>
                  <Image
                    src={"/images/about.png"}
                    alt="About"
                    height={50}
                    width={50}
                    className="w-1/5"
                  />
                  <span>Tentang</span>
                </>
              ) : (
                <>
                  <Image
                    src={"/images/tambah-produk.png"}
                    alt="Tambah Produk"
                    height={50}
                    width={50}
                    className="w-1/6"
                  />
                  <span>Tambah Produk</span>
                </>
              )}
            </Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      )}
    </>
  );
}
