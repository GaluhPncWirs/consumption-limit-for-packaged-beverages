import Link from "next/link";
import ButtonBack from "../buttonBack/btn";

export default function PathNavbar({ props, path }) {
  return (
    <>
      {path === "/mainContent" ? (
        <>
          <li>
            <Link href={"./about"} className="hover:text-red-500">
              Tentang
            </Link>
          </li>
          <li>
            <Link href={"./addProduct"} className="hover:text-red-500">
              Tambah Produk
            </Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      ) : (
        <ButtonBack path={path} props={props} />
      )}
    </>
  );
}
