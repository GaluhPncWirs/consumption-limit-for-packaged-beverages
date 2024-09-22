"use client";

import { useCalories } from "@/context/useContex";
import Image from "next/image";
import { useRef } from "react";

export default function MainContent() {
  const { yourMaxSugar } = useCalories();
  const sugarMinumanRef = useRef<HTMLInputElement>(null);
  const volumeKemasanRef = useRef<HTMLInputElement>(null);
  function calculateMaximal() {
    const sugarMinuman = parseInt(sugarMinumanRef.current?.value || "0");
    const volumeKemasan = parseInt(volumeKemasanRef.current?.value || "0");
    const product = sugarMinuman / volumeKemasan;
    const maxConsumptionMl = yourMaxSugar / product;
    if (maxConsumptionMl >= volumeKemasan) {
      console.log(
        `Konsumsi per: ${Math.floor(maxConsumptionMl / volumeKemasan)} botol`
      );
    } else {
      console.log(
        `Minuman ini bisa anda konsumsi :  ${maxConsumptionMl.toFixed(
          2
        )} ml, kurang dari satu botol.`
      );
    }
    console.log(
      maxConsumptionMl.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })
    );
  }
  return (
    <div className="bg-orange-300">
      <div className="w-5/6 mx-auto">
        <div className="w-11/12 mx-auto bg-blue-300 h-full flex flex-col justify-center">
          <div className="mt-10 flex justify-around">
            <p className="mr-2">
              Your Max Consume Sugar Per Day :{" "}
              <span>
                {yourMaxSugar.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </p>
            <div className="bg-red-400 h-48 w-60">
              <p>LeaderBoard</p>
            </div>
          </div>
          <div className="mt-7 flex items-center">
            <form
              action=""
              className="basis-4/6 flex flex-col items-center justify-center"
            >
              <div className="relative w-1/2 py-3">
                <input
                  type="number"
                  id="sugarContent"
                  step="0.01"
                  required
                  className="inputField peer"
                  ref={sugarMinumanRef}
                />
                <label htmlFor="sugarContent" className="labelText">
                  Kadar Gula dalam Minuman (gram) :
                </label>
              </div>
              <div className="relative w-1/2 py-3">
                <input
                  type="number"
                  id="volumeKemasan"
                  step="0.01"
                  required
                  className="inputField peer"
                  ref={volumeKemasanRef}
                />
                <label htmlFor="volumeKemasan" className="labelText">
                  Volume Kemasan (dalam satuan ml) :
                </label>
              </div>
            </form>
            <div className="basis-2/6">
              <Image
                src="/images/plastic-bottle-water.png"
                alt="bottle"
                width={300}
                height={400}
                className="bg-slate-100"
              />
            </div>
          </div>
          <button
            type="button"
            className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-400"
            onClick={calculateMaximal}
          >
            Hitung
          </button>
        </div>
      </div>
    </div>
  );
}
