import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ButtonBack({ path, props }) {
  const { push } = useRouter();
  function handleBack() {
    push("/mainContent/calculate");
  }
  return (
    <button
      className="px-1.5 py-0.5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-1 cursor-pointer"
      onClick={
        path === "/mainContent/addProduct" || path === "/mainContent/about"
          ? handleBack
          : props
      }
    >
      <span>Kembali</span>
      <Image
        src="/images/arrow_left.png"
        alt="arrow_left"
        className="w-1/5"
        width={200}
        height={200}
      />
    </button>
  );
}
