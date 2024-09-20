"use client";

import { useCalories } from "@/context/useContex";

export default function MainContent() {
  const { yourCalories } = useCalories();
  return (
    <div className="bg-orange-300">
      <div className="w-5/6 bg-blue-300 mx-auto h-screen">
        <div className="bg-red-300 flex">
          <p className="mr-2">Your Calories : </p>
          <h1>
            {yourCalories.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
          </h1>
        </div>
      </div>
    </div>
  );
}
