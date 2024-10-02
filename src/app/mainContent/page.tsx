"use client";

import { useCalories } from "@/context/useContex";
import { useRef, useState } from "react";

export default function MainContent() {
  const { yourMaxSugar } = useCalories();
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const [fillBottle, setFillBottle] = useState([]);
  const [choosen, setChoosen] = useState("minuman");
  const [miliLiter, setMiliLiter] = useState(0);
  const [text, setText] = useState(false);

  function calculateMaximal() {
    setText(true);
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
    <div className="bg-red-300 h-screen">
      <div className="w-11/12 mx-auto h-full">
        <div className="w-11/12 mx-auto bg-green-300 h-full flex flex-col justify-center px-5">
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
          <div className="flex gap-10 justify-center my-8">
            <button
              onClick={() => setChoosen("minuman")}
              className="bg-slate-400 rounded-lg w-1/4 font-semibold text-xl py-1"
            >
              Minuman
            </button>
            <button
              onClick={() => setChoosen("makanan")}
              className="bg-slate-300 rounded-lg w-1/4 font-semibold text-xl py-1"
            >
              Makanan
            </button>
          </div>
          {choosen === "makanan" ? (
            <div>
              <h1 className="text-center text-2xl font-bold">Makanan</h1>
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
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-center text-2xl font-bold">Minuman</h1>
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
          )}
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
        </div>
      </div>
    </div>
  );
}
