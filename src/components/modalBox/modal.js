"use client";
import { useRouter } from "next/navigation";

export default function ModalBox({ setModalBox, yourMaxSugar, tdee }) {
  const { push } = useRouter();
  function handleClick() {
    setModalBox(false);
    push("/mainContent");
  }
  return (
    <div>
      <div className="w-1/3 h-2/5 bg-green-400 z-40 absolute top-1/4 right-1/3 rounded-lg flex flex-col justify-center items-center gap-5 max-[640px]:w-3/5 max-[640px]:right-[20%] sm:w-3/5 sm:right-[20%] md:w-2/5 md:right-[30%] lg:w-1/3 lg:right-1/3">
        <h1 className="text-3xl font-bold max-[640px]:text-xl sm:text-2xl">
          Maksimal Konsumsi Gula
        </h1>
        <p className="font-semibold text-xl max-[640px]:text-lg">
          <span className="text-pink-600">
            {yourMaxSugar.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </span>{" "}
          Gram Gula/Hari
        </p>
        <p className="font-semibold text-lg max-[640px]:text-base">
          Total Kalori Kamu{" "}
          <span className="text-pink-600">
            {tdee.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </span>{" "}
          kcal
        </p>
        <div className="bg-green-500 py-1 px-4 rounded-lg mt-3 font-semibold text-lg cursor-pointer hover:bg-green-600">
          <button onClick={handleClick}>Oke</button>
        </div>
      </div>
    </div>
  );
}
