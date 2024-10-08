"use client";

import Visualization from "@/components/visualisasi/page";
import { useCalories } from "@/context/useContex";
import { useRef, useState } from "react";

export default function MainContent() {
  const { yourMaxSugar } = useCalories();
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const [fillBottle, setFillBottle] = useState([]);
  const [miliLiter, setMiliLiter] = useState(0);
  const [text, setText] = useState(false);
  const [sugarProduk, setSugarProduk] = useState(0);
  const [volumeProduk, setVolumeProduk] = useState(0);

  function calculateMaximal() {
    setText(true);
    const sugarContentInsideProduct = parseFloat(
      sugarContentInsideProductRef.current?.value || "0"
    );
    const totalVolumeInsideProduct = parseFloat(
      totalVolumeInsideProductRef.current?.value || "0"
    );
    setSugarProduk(sugarContentInsideProduct);
    setVolumeProduk(totalVolumeInsideProduct);
    const resultTotalContentProduct =
      sugarContentInsideProduct / totalVolumeInsideProduct;

    const maxConsumptionMl = yourMaxSugar / resultTotalContentProduct;
    const numberOfBottles = Math.floor(
      maxConsumptionMl / totalVolumeInsideProduct
    );

    const remainder = maxConsumptionMl % totalVolumeInsideProduct;
    const percentageFillForRemainder = Math.floor(
      (remainder / totalVolumeInsideProduct) * 100
    );

    const fillArray: any = Array(numberOfBottles).fill(100);
    if (percentageFillForRemainder > 0) {
      fillArray.push(percentageFillForRemainder);
    }
    setFillBottle(fillArray);
    setMiliLiter(percentageFillForRemainder);
  }
  return (
    <div className="bg-red-300 h-screen flex justify-center items-center">
      <div className="w-11/12 pt-10">
        <div className="w-5/6 mx-auto bg-green-300 h-full flex flex-col justify-center px-5 rounded-lg py-8">
          <div className="text-lg font-semibold">
            <p className="mr-2">
              Your Max Consume Sugar Per Day :{" "}
              <span>
                {yourMaxSugar.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}{" "}
                Grams
              </span>
            </p>
          </div>
          <div>
            <div className="mt-7 flex items-center gap-3">
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
                    Kadar Gula dalam Minuman (g) :
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
                      <div
                        className="fill"
                        style={{ height: `${item}%` }}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div className="bottleInside">
                    <div className="fill" style={{ height: "0%" }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`font-medium text-end ${
              text === true ? `visible` : `invisible`
            }`}
          >
            {fillBottle.length > 1 && miliLiter > 0 ? (
              <p>
                Konsumsi per: {fillBottle.length} botol dengan sisa{" "}
                {miliLiter.toFixed(2)} ml
              </p>
            ) : fillBottle.length > 1 && miliLiter <= 0 ? (
              <p>Konsumsi per: {fillBottle.length} botol</p>
            ) : (
              <p>
                Minuman ini bisa anda konsumsi : {miliLiter.toFixed(2)} ml,
                kurang dari satu botol
              </p>
            )}
          </div>
          <div className="bg-blue-500 py-1 rounded-lg hover:bg-blue-400 text-center mt-5 w-1/4 text-lg font-semibold">
            <button type="button" onClick={calculateMaximal}>
              Hitung
            </button>
          </div>
          <Visualization
            sugarProduk={sugarProduk}
            volumeProduk={volumeProduk}
            yourMaxSugar={yourMaxSugar}
          />
        </div>
      </div>
    </div>
  );
}
