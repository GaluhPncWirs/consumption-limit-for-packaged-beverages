"use client";

import { useCalories } from "@/context/useContex";
import { useRef, useState } from "react";

export default function MainContent() {
  const { yourMaxSugar } = useCalories();
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const [fillBottle, setFillBottle] = useState([]);
  const [totalBottle, setTotalBottle] = useState(0);

  function calculateMaximal() {
    const sugarContentInsideProduct = parseFloat(
      sugarContentInsideProductRef.current?.value || "0"
    );
    const totalVolumeInsideProduct = parseFloat(
      totalVolumeInsideProductRef.current?.value || "0"
    );
    const resultTotalContentProduct =
      sugarContentInsideProduct / totalVolumeInsideProduct;

    const maxConsumptionMl = yourMaxSugar / resultTotalContentProduct;
    const numberOfBottles = Math.floor(
      maxConsumptionMl / totalVolumeInsideProduct
    );
    setTotalBottle(numberOfBottles);

    const remainder = maxConsumptionMl % totalVolumeInsideProduct;
    const percentageFillForRemainder = Math.floor(
      (remainder / totalVolumeInsideProduct) * 100
    );

    const fillArray: any = Array(numberOfBottles).fill(100);
    if (percentageFillForRemainder > 0) {
      fillArray.push(percentageFillForRemainder);
    }
    setFillBottle(fillArray);
    console.log(fillBottle);

    // if (numberOfBottles >= 1) {
    //   console.log(`Konsumsi per: ${numberOfBottles} botol`);
    // } else {
    //   console.log(
    //     `Minuman ini bisa anda konsumsi :  ${maxConsumptionMl.toFixed(
    //       2
    //     )} ml, kurang dari satu botol.`
    //   );
    //   if (fillBottle.current[0]) {
    //     fillBottle.current[0].style.height = `${percentageFillForRemainder}%`;
    //   }
    // }
  }
  return (
    <div className="bg-orange-300">
      <div className="w-5/6 mx-auto h-screen">
        <div className="w-11/12 mx-auto bg-blue-300 h-full flex flex-col justify-center">
          <div className="flex ml-5">
            <p className="mr-2">
              Your Max Consume Sugar Per Day :{" "}
              <span>
                {yourMaxSugar.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </p>
          </div>
          <div className="mt-7 flex items-center">
            <form
              action=""
              className="basis-2/5 flex flex-col items-center justify-center"
            >
              <div className="relative w-4/5 py-3">
                <input
                  type="number"
                  id="sugarContent"
                  required
                  className="inputField peer"
                  ref={sugarContentInsideProductRef}
                />
                <label htmlFor="sugarContent" className="labelText">
                  Kadar Gula dalam Minuman (gram) :
                </label>
              </div>
              <div className="relative w-4/5 py-3">
                <input
                  type="number"
                  id="volumeKemasan"
                  required
                  className="inputField peer"
                  ref={totalVolumeInsideProductRef}
                />
                <label htmlFor="volumeKemasan" className="labelText">
                  Volume Kemasan (ml) :
                </label>
              </div>
            </form>
            <div className="basis-3/5 mb-5 flex justify-center items-center">
              {fillBottle.length > 0 ? (
                fillBottle.map((item: any, i: number) => (
                  <div key={i} className="bottleInside w-1/5">
                    <div className="fill" style={{ height: `${item}%` }}></div>
                  </div>
                ))
              ) : (
                <div className="bottleInside">
                  <div className="fill" style={{ height: "0%" }}></div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-400 text-center mt-20">
            <button type="button" onClick={calculateMaximal}>
              Hitung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
