"use client";
import { useEffect, useRef, useState } from "react";
import { useHandleInput } from "./hooks/handle-input";
import Image from "next/image";
import ModalBox from "@/components/modalBox/modalSucces";
import IconWarning from "@/components/warningIcon/icon";
import ComponentInput from "@/components/input/content";

export default function DisplayInputUser() {
  const male = useRef<HTMLInputElement>(null);
  const female = useRef<HTMLInputElement>(null);
  const ages = useRef<HTMLInputElement>(null);
  const bodyHeight = useRef<HTMLInputElement>(null);
  const bodyWeight = useRef<HTMLInputElement>(null);
  const activityLevel = useRef<HTMLSelectElement>(null);
  const [modalBox, setModalBox] = useState<boolean>(false);
  const [modalErrorBox, setModalErrorBox] = useState<boolean>(false);
  const [yourMaxSugar, setYourMaxSugar] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [validate, setValidate] = useState<boolean>(false);

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
    if (
      maxAge > 2 ||
      maxHeight > 3 ||
      maxWeight > 2 ||
      mustFilled.age >= 60 ||
      mustFilled.age <= 10 ||
      mustFilled.height >= 200 ||
      mustFilled.height <= 50 ||
      mustFilled.weight >= 80 ||
      mustFilled.weight <= 10
    ) {
      setModalErrorBox(true);
    } else {
      const age = parseInt(ages.current?.value || "0");
      const weight = parseInt(bodyWeight.current?.value || "0");
      const height = parseInt(bodyHeight.current?.value || "0");
      let BMR; // Basal Metabolic Rate

      // jika radio button laki-laki terpilih
      if (male.current?.checked) {
        // jika isi radio button berupa "male"
        if (male.current?.value === "male") {
          // maka rumusnya ini
          BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        }
      }
      // jika radio button perempuan terpilih
      if (female.current?.checked) {
        // jika isi radio button berupa "female"
        if (female.current?.value === "female") {
          // maka rumusnya ini
          BMR = 10 * weight + 6.25 * height - 5 * age - 161;
        }
      }
      // variabel kosong untuk menampung nilai
      let activityFactor;
      // cek nilai dari tingkat aktifitas
      switch (activityLevel.current?.value) {
        // jika tingkat aktifitas "sedentary"
        case "sedentary":
          // maka "activityFactor = 1.2" akan mengisi nilai
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

      // lalu variabel TDEE menyimpan jumlah kalori perhari
      const TDEE = BMR! * activityFactor;
      // untuk menghitung jumlah gula perhari
      const kalori = TDEE * 0.1; // berdasarkan pedoman WHO 10%
      const maxSugarPerGrams = kalori / 4; // hasil kalori dibagi 4 karena 1 g gula = 4 kalori
      setYourMaxSugar(maxSugarPerGrams);
      setTdee(TDEE);
      // let maxCalories;

      // const convertToMeters = height / 100;
      // const heightSquares = Math.pow(convertToMeters, 2);
      // let bodyMassIndex = Math.floor(weight / heightSquares);

      // if (bodyMassIndex >= 30) {
      //   // obesitas
      //   maxCalories = TDEE * 0.05;
      // } else {
      //   // normal
      //   maxCalories = TDEE * 0.1;
      // }
    }
  }

  useEffect(() => {
    if (yourMaxSugar !== 0 && tdee !== 0) {
      if (yourMaxSugar < 10 || yourMaxSugar > 50) {
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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#f9fff9] rounded-lg py-7 px-3 mx-auto shadow-lg shadow-slate-700">
        <h1 className="text-center mb-7 text-2xl font-bold tracking-wide max-[640px]:text-xl">
          Penghitung Kalori & Gula Harian
        </h1>
        <form id="sugarForm" className="mx-10">
          <div className="flex flex-col justify-center gap-y-5">
            <div
              className="flex gap-5 items-center font-semibold"
              id="inputGender"
            >
              <div className="flex gap-x-4 items-center">
                <Image
                  width={200}
                  height={200}
                  src="/images/pageCalculateCalories/gender.png"
                  alt="gender"
                  className="size-8"
                />
                <span className="text-lg">Gender</span>
                <input
                  type="radio"
                  value="male"
                  id="gender"
                  name="gender"
                  ref={male}
                  className="cursor-pointer bg-green-200"
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
            </div>

            <ComponentInput
              titleInput="Usia (tahun)"
              srcImg="/images/pageCalculateCalories/age.png"
              altImg="age"
            >
              <input
                type="number"
                id="age"
                min={10}
                max={60}
                className="inputField peer"
                ref={ages}
                onChange={handleValueInput}
                value={mustFilled.age}
                maxLength={2}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Tinggi Badan (cm)"
              srcImg="/images/pageCalculateCalories/height.png"
              altImg="height"
            >
              <input
                type="number"
                id="height"
                min={50}
                max={200}
                className="inputField peer"
                ref={bodyHeight}
                onChange={handleValueInput}
                value={mustFilled.height}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Berat Badan (kg)"
              srcImg="/images/pageCalculateCalories/weight.png"
              altImg="weight"
            >
              <input
                type="number"
                id="height"
                min={50}
                max={200}
                className="inputField peer"
                ref={bodyHeight}
                onChange={handleValueInput}
                value={mustFilled.height}
              />
            </ComponentInput>

            <div className="font-semibold">
              <div className="flex gap-x-3 mb-2">
                <Image
                  width={200}
                  height={200}
                  src="/images/pageCalculateCalories/activity.png"
                  alt="activity"
                  className="size-8"
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
                  Extra Aktif (olahraga yang sangat keras atau pekerjaan fisik)
                </option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateMaxSugar}
            disabled={!isFormFilled()}
            className="disabled:cursor-not-allowed text-white mt-7 mx-auto py-1 text-center rounded-md bg-[#2e8b57] hover:bg-[#27744a] cursor-pointer font-semibold tracking-wide px-7 text-lg max-[640px]:mt-4"
          >
            Hitung
          </button>
        </form>
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
            <div className="h-full w-full absolute inset-0 bg-black/50">
              <div className="bg-[#4ADE80] w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/3 z-40 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 shadow-lg shadow-slate-700">
                <div className="flex justify-center items-center h-3/4 gap-x-8 max-[640px]:gap-x-5 max-[640px]:px-5 sm:px-6 md:px-8 lg:px-10 max-[640px]:h-5/6">
                  <IconWarning />
                  <div className="w-full">
                    <h1 className="font-bold text-xl max-[640px]:text-lg">
                      Perhitungan Tidak Valid
                    </h1>
                    <p className="font-medium mt-3 max-[640px]:mt-2">
                      Hasilnya Tidak Memenuhi Standar, Silahkan Input Kembali !
                    </p>
                  </div>
                </div>
                <div className="h-1/4 bg-[#22C55E] rounded-b-xl flex justify-center items-center hover:bg-green-600 max-[640px]:h-1/5">
                  <button
                    className="text-xl font-semibold w-full h-full max-[640px]:text-lg"
                    onClick={() => setModalErrorBox(false)}
                  >
                    Oke
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
