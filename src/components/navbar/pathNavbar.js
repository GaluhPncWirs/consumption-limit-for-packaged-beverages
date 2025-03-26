import Link from "next/link";
import ButtonBack from "../button/btnBack";
import { useEffect, useState } from "react";

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
            <Link href={"/mainContent/about"} className="hover:text-red-500">
              Tentang
            </Link>
          </li>
          <li>
            <Link
              href={"/mainContent/addProduct"}
              className="hover:text-red-500"
            >
              Tambah Produk
            </Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      ) : (
        <>
          <li>
            <Link href={pathConditions.path} className="hover:text-red-500">
              {pathConditions.textNavbar}
            </Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      )}
    </>
  );
}
