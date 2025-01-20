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
      <div className="w-1/3 h-2/5 bg-green-300 z-40 absolute top-1/4 right-1/3 rounded-lg flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl font-bold text-amber-600">
          Maksimal Konsumsi Gula
        </h1>
        <p className="font-semibold text-xl">
          <span className="text-pink-600">
            {yourMaxSugar.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </span>{" "}
          Gram Gula/Hari
        </p>
        <p className="font-semibold text-lg">
          Total Kalori Kamu{" "}
          <span className="text-pink-600">
            {tdee.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </span>{" "}
          kcal
        </p>
        <div className="bg-green-400 py-1 px-4 rounded-lg mt-3 font-semibold text-lg cursor-pointer hover:bg-green-500">
          <button onClick={handleClick}>Oke</button>
        </div>
      </div>
    </div>
  );
}
