"use client";

import { useCalories } from "@/context/useContex";

export default function MainContent() {
  const { yourMaxSugar } = useCalories();
  return (
    <div className="bg-orange-300">
      <div className="w-5/6 bg-blue-300 mx-auto h-screen">
        <div className="w-11/12 mx-auto">
          <div className="pt-5 pl-10">
            <p className="mr-2">
              Your Max Consume Sugar Per Day :{" "}
              <span>
                {yourMaxSugar.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </p>
          </div>
          <div className="mt-7">
            <form action="" className="flex justify-evenly">
              <div className="relative w-1/3 py-3">
                <input
                  type="number"
                  id="sugarContent"
                  step="0.01"
                  required
                  className="inputField peer"
                />
                <label htmlFor="sugarContent" className="labelText">
                  Kadar Gula dalam Minuman (gram) :
                </label>
              </div>
              <div className="relative w-1/3 py-3">
                <input
                  type="number"
                  id="volumeKemasan"
                  step="0.01"
                  required
                  className="inputField peer"
                />
                <label htmlFor="volumeKemasan" className="labelText">
                  Volume Kemasan (dalam satuan ml) :
                </label>
              </div>
            </form>
            <button type="button">Hitung Konsumsi Maksimal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
