"use client";
import ModalBox from "@/components/modalBox/modalSucces";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useHandleInput } from "./hooks/handle-input";
import CalculateCaloriesError from "@/components/modalBox/layoutHorizontal/modalErrHor/calculateErr";

export default function DisplayInputUser() {
  const male = useRef<HTMLInputElement>(null);
  const female = useRef<HTMLInputElement>(null);
  const ages = useRef<HTMLInputElement>(null);
  const bodyHeight = useRef<HTMLInputElement>(null);
  const bodyWeight = useRef<HTMLInputElement>(null);
  const activityLevel = useRef<HTMLSelectElement>(null);
  const [modalBox, setModalBox] = useState(false);
  const [modalErrorBox, setModalErrorBox] = useState(false);
  const [yourMaxSugar, setYourMaxSugar] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [validate, setValidate] = useState(false);

  const { mustFilled, handleValueInput, isFormFilled, setMustFilled } =
    useHandleInput({
      age: "",
      height: "",
      weight: "",
      gender: "",
      activityLevel: "",
    });

  const maxAge = mustFilled.age.length;
  const maxHeight = mustFilled.height.length;
  const maxWeight = mustFilled.weight.length;

  function calculateMaxSugar() {
    if (maxAge > 2 || maxHeight > 3 || maxWeight > 3) {
      setModalErrorBox(true);
    } else {
      const age = parseInt(ages.current?.value || "0");
      const weight = parseInt(bodyWeight.current?.value || "0");
      const height = parseInt(bodyHeight.current?.value || "0");
      let BMR; // Basal Metabolic Rate

      if (male.current?.checked) {
        if (male.current?.value === "male") {
          BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        }
      }

      if (female.current?.checked) {
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
      let maxCalories;

      const convertToMeters = height / 100;
      const heightSquares = Math.pow(convertToMeters, 2);
      let bodyMassIndex = Math.floor(weight / heightSquares);

      if (bodyMassIndex >= 30) {
        // obesitas
        maxCalories = TDEE * 0.05;
      } else {
        // normal
        maxCalories = TDEE * 0.1;
      }

      const maxSugarPerGrams = maxCalories / 4; // Karena 1 gram gula = 4 kalori
      setYourMaxSugar(maxSugarPerGrams);
      setTdee(TDEE);
    }
  }

  useEffect(() => {
    if (yourMaxSugar !== 0 && tdee !== 0) {
      if (yourMaxSugar < 5) {
        setModalErrorBox(true);
      } else {
        setModalBox(true);
        setValidate(true);
      }
    } else {
      return undefined;
    }
  }, [yourMaxSugar, tdee]);

  useEffect(() => {
    if (!validate) {
      document.cookie =
        "formFilledSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      localStorage.removeItem("maxSugars");
    } else {
      document.cookie = "formFilledSuccess=true; path=/";
      localStorage.setItem("maxSugars", String(yourMaxSugar));
    }
  }, [validate, yourMaxSugar]);

  useEffect(() => {
    if (!validate) {
      setMustFilled({
        age: "",
        height: "",
        weight: "",
        gender: "",
        activityLevel: "",
      });
    }
  }, [validate, setMustFilled, modalErrorBox]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-screen">
      <div className="w-full">
        <div className="bg-[#73EC8B] rounded-lg py-9 px-5 max-w-xl mx-auto shadow-lg max-[640px]:max-w-md inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10">
          {/* <div className="mb-5 text-center text-lg font-semibold">
  <h2>
    silahkan inputkan di bawah ini agar bisa mengetahui berapa
    kalori anda{" "}
  </h2>
</div> */}
          <h1 className="text-center mb-8 text-xl font-bold max-[640px]:text-lg">
            Penghitung Batas Aman Konsumsi Produk Manis Kemasan
          </h1>
          <form
            id="sugarForm"
            className="max-[640px]:mx-7 mx-10 text-[#393E46]"
          >
            <div className="flex flex-col justify-center gap-4">
              <div
                className="flex gap-2 mb-1 items-center font-semibold"
                id="inputGender"
              >
                <div className="flex gap-3 mr-2">
                  <Image
                    width={30}
                    height={20}
                    src={"/images/gender.png"}
                    alt="gender"
                    style={{ height: "auto", width: "auto" }}
                  />
                  <span className="text-lg">Gender</span>
                </div>
                <input
                  type="radio"
                  value="male"
                  id="gender"
                  name="gender"
                  ref={male}
                  className="cursor-pointer"
                  onChange={handleValueInput}
                  checked={mustFilled.gender === "male"}
                />
                <label htmlFor="gender">Pria</label>
                <input
                  type="radio"
                  value="female"
                  id="gender"
                  name="gender"
                  ref={female}
                  className="cursor-pointer bg-green-200"
                  onChange={handleValueInput}
                  checked={mustFilled.gender === "female"}
                />
                <label htmlFor="gender">Wanita</label>
              </div>

              <div className="relative w-1/2 pt-5 max-[640px]:w-full sm:w-full font-semibold">
                <input
                  type="number"
                  id="age"
                  min={5}
                  max={70}
                  className="inputField peer"
                  ref={ages}
                  onChange={handleValueInput}
                  value={mustFilled.age}
                  maxLength={2}
                />
                <label
                  htmlFor="age"
                  className="labelText flex flex-row-reverse gap-2"
                >
                  <span>Usia (tahun)</span>
                  <Image
                    width={30}
                    height={20}
                    src={"/images/age.png"}
                    alt="age"
                    style={{ height: "auto", width: "auto" }}
                  />
                </label>
              </div>

              <div className="relative w-1/2 pt-5 font-semibold max-[640px]:w-full sm:w-full">
                <input
                  type="number"
                  id="height"
                  min={20}
                  max={200}
                  className="inputField peer"
                  ref={bodyHeight}
                  onChange={handleValueInput}
                  value={mustFilled.height}
                />
                <label
                  htmlFor="age"
                  className="labelText flex flex-row-reverse gap-2"
                >
                  <span>Tinggi Badan (cm)</span>
                  <Image
                    width={30}
                    height={20}
                    src={"/images/height.png"}
                    alt="height"
                    style={{ height: "auto", width: "auto" }}
                  />
                </label>
              </div>

              <div className="relative w-1/2 pt-5 font-semibold max-[640px]:w-full sm:w-full">
                <input
                  type="number"
                  id="weight"
                  min={10}
                  max={100}
                  className="inputField peer"
                  ref={bodyWeight}
                  onChange={handleValueInput}
                  value={mustFilled.weight}
                  maxLength={3}
                />
                <label
                  htmlFor="age"
                  className="labelText flex flex-row-reverse gap-2"
                >
                  <span>Berat Badan (kg)</span>
                  <Image
                    width={30}
                    height={20}
                    src={"/images/weight.png"}
                    alt="weight"
                    style={{ height: "auto", width: "auto" }}
                  />
                </label>
              </div>

              <div className="font-semibold">
                <div className="flex gap-x-2 mb-2">
                  <Image
                    width={29}
                    height={20}
                    className="w-[30px]"
                    src={"/images/activity.png"}
                    alt="activity"
                  />
                  <label htmlFor="activityLevel" className="block mb-2 text-lg">
                    Activity Level
                  </label>
                </div>
                <select
                  id="activityLevel"
                  className="cursor-pointer bg-[#54C392] rounded-md p-2 text-sm max-[640px]:w-full sm:w-full"
                  ref={activityLevel}
                  value={mustFilled.activityLevel}
                  onChange={handleValueInput}
                >
                  <option value="" disabled hidden>
                    Pilih Tingkat Aktivitas
                  </option>
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
            </div>
          </form>
          <div className="flex justify-center">
            <button
              onClick={() => calculateMaxSugar()}
              disabled={!isFormFilled()}
              className="disabled:cursor-not-allowed mt-8 mx-auto py-1 text-center rounded-md bg-[#15B392] hover:bg-emerald-500 cursor-pointer font-semibold px-7 text-lg"
            >
              Hitung
            </button>
          </div>
        </div>
        <div>
          {validate === true && (
            <ModalBox
              setModalBox={setModalBox}
              yourMaxSugar={yourMaxSugar}
              tdee={tdee}
              setValidate={setValidate}
            />
          )}

          {modalErrorBox && (
            <CalculateCaloriesError setModalBoxErr={setModalErrorBox} />
          )}
        </div>
      </div>
      {validate === true || modalErrorBox === true ? (
        <div className="h-screen w-screen absolute inset-0 bg-black/50"></div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
