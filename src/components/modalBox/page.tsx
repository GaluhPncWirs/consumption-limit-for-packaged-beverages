"use client";
import { useRouter } from "next/navigation";

export default function ModalBox({ setModalBox, yourMaxSugar, tdee }: any) {
  const { push } = useRouter();
  function handleClick() {
    setModalBox(false);
    push("/mainContent");
  }
  return (
    <div>
      <div className="w-1/3 h-1/3 bg-slate-200 z-40 absolute top-1/3 right-1/3 rounded-lg flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl font-bold">Your Max Consume Sugar</h1>
        <p className="font-semibold text-xl">
          Your Calories{" "}
          {tdee.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
        </p>
        <p className="font-semibold text-xl">
          {yourMaxSugar.toLocaleString("id-ID", { maximumFractionDigits: 0 })}{" "}
          Gram Gula/Hari
        </p>
        <div className="bg-slate-300 py-1 px-4 rounded-lg mt-3 font-semibold text-lg cursor-pointer hover:bg-slate-400">
          <button onClick={handleClick}>Oke</button>
        </div>
      </div>
    </div>
  );
}
