"use client";
import { useCalories } from "@/context/useContex";
import { useRouter } from "next/navigation";

export default function ModalBox({ setModalBox }: any) {
  const { push } = useRouter();
  const { yourCalories } = useCalories();
  function handleClick() {
    setModalBox(false);
    push("/mainContent");
  }
  return (
    <div>
      <div className="w-1/3 h-1/3 bg-slate-200 z-40 absolute top-1/3 right-1/3 rounded-lg flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl font-bold">Your Calories</h1>
        <p className="font-semibold text-xl">
          {yourCalories.toLocaleString("id-ID", { maximumFractionDigits: 0 })}{" "}
          kkal/hari
        </p>
        <div className="bg-slate-300 py-1 px-4 rounded-lg mt-3">
          <button onClick={handleClick}>oke</button>
        </div>
      </div>
    </div>
  );
}
