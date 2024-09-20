"use client";
import ModalBox from "@/components/modalBox/page";
import { useCalories } from "@/context/useContex";
import { useRef, useState } from "react";

export default function DisplayInputUser() {
  // function calculateCalories() {
  //     const age = parseInt(document.getElementById("age").value);
  //     const gender = document.querySelector("input[name=option]:checked").value;
  //     const weight = parseFloat(document.getElementById("weight").value);
  //     const height = parseFloat(document.getElementById("height").value);
  //     const activityLevel = document.getElementById("activityLevel").value;
  //     const sugarContent = parseFloat(
  //       document.getElementById("sugarContent").value
  //     );
  //     const volumeKemasan = parseFloat(
  //       document.getElementById("volumeKemasan").value
  //     );
  //     const healthStatus = document.getElementById("healthStatus").value;
  //     const result = document.getElementById("result");
  //     const perBottle = document.getElementById("perBotol");
  //     let BMR; // Basal Metabolic Rate

  //     // Hitung BMR berdasarkan jenis kelamin
  //     if (gender === "male") {
  //       BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  //     }

  //     if (gender === "female") {
  //       BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  //     }

  //     // Tentukan faktor aktivitas
  //     let activityFactor;
  //     switch (activityLevel) {
  //       case "sedentary":
  //         activityFactor = 1.2;
  //         break;
  //       case "lightlyActive":
  //         activityFactor = 1.375;
  //         break;
  //       case "moderatelyActive":
  //         activityFactor = 1.55;
  //         break;
  //       case "veryActive":
  //         activityFactor = 1.725;
  //         break;
  //       case "extraActive":
  //         activityFactor = 1.9;
  //         break;
  //       default:
  //         activityFactor = 1.2;
  //     }

  //     const TDEE = BMR * activityFactor;
  //     let maxSugarCalories;

  //     // Sesuaikan berdasarkan status kesehatan
  //     if (healthStatus === "overweight") {
  //       maxSugarCalories = TDEE * 0.08;
  //     } else if (healthStatus === "diabetic") {
  //       maxSugarCalories = TDEE * 0.05;
  //     } else {
  //       maxSugarCalories = TDEE * 0.1;
  //     }

  //     const maxSugarGrams = maxSugarCalories / 4; // Karena 1 gram gula = 4 kalori
  //     const product = sugarContent / volumeKemasan;
  //     const maxConsumptionMl = maxSugarGrams / product;

  //     // console.log("Kebutuhan Kalori Harian (TDEE):" + TDEE.toFixed(2));
  //     result.textContent = `Konsumsi Gula Maksimal (gram): ${maxSugarGrams.toFixed(
  //       2
  //     )}`;

  //     if (maxConsumptionMl >= volumeKemasan) {
  //       perBottle.textContent = `Konsumsi per: ${Math.floor(
  //         maxConsumptionMl / volumeKemasan
  //       )} botol`;
  //     } else {
  //       perBottle.textContent = `Minuman ini bisa anda konsumsi :  ${maxConsumptionMl.toFixed(
  //         2
  //       )} ml, kurang dari satu botol.`;
  //     }
  //   }

  const male = useRef<HTMLInputElement>(null);
  const female = useRef<HTMLInputElement>(null);
  const ages = useRef<HTMLInputElement>(null);
  const bodyHeight = useRef<HTMLInputElement>(null);
  const bodyWeight = useRef<HTMLInputElement>(null);
  const activityLevel = useRef<HTMLSelectElement>(null);
  const healthStatus = useRef<HTMLSelectElement>(null);
  const { setYourMaxSugar } = useCalories();
  const [modalBox, setModalBox] = useState(false);

  function calculateMaxSugar() {
    const age = parseInt(ages.current?.value || "0");
    const weight = parseInt(bodyWeight.current?.value || "0");
    const height = parseFloat(bodyHeight.current?.value || "0");
    let BMR; // Basal Metabolic Rate
    setModalBox(true);

    if (male.current?.checked) {
      if (male.current?.value === "male") {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
      }
    } else {
      if (female.current?.value === "female") {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
      }
    }

    let activityFactor;
    switch (activityLevel.current?.value) {
      case "sedentary":
        activityFactor = 1.2;
        break;
      case "lightlyActive":
        activityFactor = 1.375;
        break;
      case "moderatelyActive":
        activityFactor = 1.55;
        break;
      case "veryActive":
        activityFactor = 1.725;
        break;
      case "extraActive":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const TDEE = BMR! * activityFactor;
    let maxSugarCalories;

    // Sesuaikan berdasarkan status kesehatan
    if (healthStatus.current?.value === "overweight") {
      maxSugarCalories = TDEE * 0.08;
    } else if (healthStatus.current?.value === "diabetic") {
      maxSugarCalories = TDEE * 0.05;
    } else {
      maxSugarCalories = TDEE * 0.1;
    }

    const maxSugarPerGrams = maxSugarCalories / 4; // Karena 1 gram gula = 4 kalori
    setYourMaxSugar(maxSugarPerGrams);
    // console.log("Kebutuhan Kalori Harian (TDEE):" + TDEE.toFixed(2));
  }

  return (
    <>
      <div className="w-full">
        <div>
          <h1 className="text-center mb-5 text-xl font-bold">
            Penghitung Konsumsi Batas Aman Konsumsi Gula Harian{" "}
          </h1>
          <div className="bg-blue-300 rounded-lg py-5 px-3 max-w-xl mx-auto shadow-lg">
            {/* <div className="mb-5 text-center text-lg font-semibold">
              <h2>
                silahkan inputkan di bawah ini agar bisa mengetahui berapa
                kalori anda{" "}
              </h2>
            </div> */}
            <form
              id="sugarForm"
              className="flex flex-col justify-center gap-4 ml-5"
            >
              <div id="inputGender" className="flex gap-2 items-center">
                <span className="text-lg">Gender : </span>
                <input
                  type="radio"
                  value="male"
                  name="option"
                  ref={male}
                  className="cursor-pointer"
                />
                <label htmlFor="gender">Pria</label>
                <input
                  type="radio"
                  value="female"
                  name="option"
                  ref={female}
                  className="cursor-pointer"
                />
                <label htmlFor="gender">Wanita</label>
              </div>

              <div className="relative w-1/2 py-3">
                <input
                  type="number"
                  id="age"
                  className="inputField peer"
                  ref={ages}
                />
                <label htmlFor="age" className="labelText">
                  Usia (tahun) :
                </label>
              </div>

              <div className="relative w-1/2 py-3">
                <input
                  type="number"
                  id="height"
                  className="inputField peer"
                  ref={bodyHeight}
                />
                <label htmlFor="height" className="labelText">
                  Tinggi Badan (cm) :
                </label>
              </div>

              <div className="relative w-1/2 pt-3">
                <input
                  type="number"
                  id="weight"
                  className="inputField peer"
                  ref={bodyWeight}
                />
                <label htmlFor="weight" className="labelText">
                  Berat Badan (kg) :
                </label>
              </div>

              <div>
                <label htmlFor="activityLevel" className="block mb-2 text-lg">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  className="cursor-pointer bg-slate-300 rounded-md p-2 text-sm"
                  ref={activityLevel}
                >
                  <option value="sedentary">
                    Tidak Aktif (Tidak Melakukan Aktifitas Berat)
                  </option>
                  <option value="lightlyActive">
                    Aktif (olahraga ringan 1-3 hari per minggu)
                  </option>
                  <option value="moderatelyActive">
                    Cukup Aktif (olahraga sedang 3-5 hari per minggu)
                  </option>
                  <option value="veryActive">
                    Sangat Aktif (olahraga keras 6-7 hari per minggu)
                  </option>
                  <option value="extraActive">
                    Extra Aktif (olahraga yang sangat keras atau pekerjaan
                    fisik)
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="healthStatus" className="block mb-2 text-lg">
                  Status Kesehatan
                </label>
                <select
                  id="healthStatus"
                  className="p-2 rounded-md bg-slate-300 text-sm cursor-pointer"
                  ref={healthStatus}
                >
                  <option value="normal">Normal</option>
                  <option value="overweight">Obesitas</option>
                  <option value="diabetic">Diabetes</option>
                </select>
              </div>
            </form>
            <div className="mt-4 mx-auto text-center max-w-20 rounded-md bg-slate-300 hover:bg-slate-400">
              <button onClick={calculateMaxSugar}>Hitung</button>
            </div>
          </div>
          <div>{modalBox && <ModalBox setModalBox={setModalBox} />}</div>
        </div>
      </div>
    </>
  );
}
