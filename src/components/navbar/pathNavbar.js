import Link from "next/link";
import ButtonBack from "../buttonBack/btn";

export default function PathNavbar({ props, path }) {
  return (
    <>
      <li>
        <Link href={"./about"}>Tentang</Link>
      </li>
      {path === "/mainContent" || path === "/about" ? (
        <>
          <li>
            <Link href={"./addProduct"}>Tambah Produk</Link>
          </li>
          <ButtonBack path={path} props={props} />
        </>
      ) : (
        <ButtonBack path={path} props={props} />
      )}
    </>
  );
}
