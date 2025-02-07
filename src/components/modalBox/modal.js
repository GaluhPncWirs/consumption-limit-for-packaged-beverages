"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ModalBox({ setModalBox, yourMaxSugar, tdee }) {
  const { push } = useRouter();
  function handleClick() {
    setModalBox(false);
    push("/mainContent");
  }
  return (
    <div>
      <div className="w-1/3 bg-green-400 z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col justify-center items-center gap-4 max-[640px]:w-3/5 sm:w-3/5 md:w-2/5 lg:w-1/3 pt-5">
        <Image
          src={"/images/check.png"}
          alt="check"
          width={50}
          height={50}
          className="bg-white rounded-full"
        />
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
        <div className="bg-green-500 w-full rounded-b-lg flex justify-center py-2 hover:bg-green-600">
          <button
            onClick={handleClick}
            className="font-semibold text-xl cursor-pointer w-full"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
