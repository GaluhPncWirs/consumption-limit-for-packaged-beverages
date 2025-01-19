import Image from "next/image";
import Link from "next/link";

export default function ButtonBack({ path, props }) {
  return (
    <>
      {path === "/addProduct" ? (
        <div className="absolute top-0 left-0 px-3 bg-green-400 py-1.5 hover:bg-green-500 rounded-br-lg flex flex-row-reverse justify-center items-center gap-1 cursor-pointer">
          <Link href={"./mainContent"} className="text-xl font-semibold">
            Kembali
          </Link>
          <Image
            src="/images/arrow_left.png"
            alt="arrow_left"
            className="w-1/5"
            width={200}
            height={200}
          />
        </div>
      ) : (
        <div className="px-2 py-1.5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-1 cursor-pointer">
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
        </div>
      )}
    </>
  );
}
