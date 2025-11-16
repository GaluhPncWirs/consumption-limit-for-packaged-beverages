import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ButtonBack({ path }) {
  const { push } = useRouter();
  function backToInput() {
    localStorage.removeItem("maxSugars");
    document.cookie =
      "formFilledSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    push("/");
  }
  return (
    <button
      className="py-2 px-5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-x-2 cursor-pointer"
      onClick={
        path === "/mainContent/addProduct" || path === "/mainContent/about"
          ? () => push("/mainContent/calculate")
          : backToInput
      }
    >
      <span>Kembali</span>
      <Image
        src="/images/global/arrow_left.png"
        alt="arrow_left"
        className="size-9"
        width={200}
        height={200}
      />
    </button>
  );
}
