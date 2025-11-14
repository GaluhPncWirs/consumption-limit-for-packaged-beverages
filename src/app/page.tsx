"use client";
import { useEffect, useState } from "react";
import { useHandleInput } from "./hooks/handle-input";
import Image from "next/image";
import ComponentInput from "@/components/input/content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DisplayInputUser() {
  const [selectedValueActivityLevel, setSelectedValueActivityLevel] =
    useState<string>("");
  const [errorCalculation, setErrorCalculation] = useState<boolean>(false);
  const [isValidCalculation, setIsValidCalculation] = useState<boolean>(false);
  const [yourMaxSugar, setYourMaxSugar] = useState<number>(0);
  const [TDEE, setTDEE] = useState<number>(0);
  const { push } = useRouter();

  const { mustFilled, handleValueInput, isFormFilled } = useHandleInput({
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
  });

  function handleCalculateCalories(event: any) {
    event.preventDefault();

    const gender = event.target.gender.value;
    const age = Number(event.target.age.value);
    const heightBody = Number(event.target.height.value);
    const weightBody = Number(event.target.weight.value);

    const maxLengthAge = event.target.age.value.length;
    const maxLengthHeight = event.target.height.value.length;
    const maxLengthWeight = event.target.weight.value.length;

    if (
      maxLengthAge > 2 ||
      maxLengthHeight > 3 ||
      maxLengthWeight > 2 ||
      age >= 60 ||
      age <= 10 ||
      heightBody >= 200 ||
      heightBody <= 50 ||
      weightBody >= 80 ||
      weightBody <= 10
    ) {
      setErrorCalculation(true);
      toast("❌ Perhitungan Tidak Valid", {
        description:
          "Hasilnya tidak memenuhi standar, silahkan input kembali !",
      });
    } else {
      setErrorCalculation(false);

      let basalMetabolicRate: number | null = null;

      if (gender === "male") {
        basalMetabolicRate = 10 * weightBody + 6.25 * heightBody - 5 * age + 5;
      }

      if (gender === "female") {
        basalMetabolicRate =
          10 * weightBody + 6.25 * heightBody - 5 * age + 161;
      }

      let choosenActivityLevel: number | null = null;

      switch (selectedValueActivityLevel) {
        case "sedentary":
          choosenActivityLevel = 1.2;
          break;
        case "lightlyActive":
          choosenActivityLevel = 1.375;
          break;
        case "moderatelyActive":
          choosenActivityLevel = 1.55;
          break;
        case "veryActive":
          choosenActivityLevel = 1.725;
          break;
        case "extraActive":
          choosenActivityLevel = 1.9;
          break;
        default:
          choosenActivityLevel = 1.2;
      }

      const totalDailyEnergyExpenditure =
        basalMetabolicRate! * choosenActivityLevel;
      const resultTotalCalorie = totalDailyEnergyExpenditure * 0.1;
      const resultTotalMaxSugar = resultTotalCalorie / 4;

      if (resultTotalMaxSugar < 10 || resultTotalMaxSugar > 50) {
        toast("Perhitungan Tidak Valid ❌", {
          description:
            "Hasilnya Tidak Memenuhi Standar, Silahkan Input Kembali !",
        });
        setIsValidCalculation(false);
      }

      setTDEE(totalDailyEnergyExpenditure);
      setYourMaxSugar(resultTotalMaxSugar);
    }
  }

  useEffect(() => {
    if (!isValidCalculation || !yourMaxSugar) return;
    async function isCalculateSuccess() {
      const req = await fetch("/api/setCookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validCaculations: isValidCalculation }),
      });

      const response = await req.json();
      if (response.status) {
        console.log(response.message);
        push("/mainContent/calculate");
        localStorage.setItem("maxSugarUser", String(yourMaxSugar));
      }
    }
    isCalculateSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidCalculation, yourMaxSugar]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#f9fff9] rounded-lg py-7 shadow-lg shadow-slate-700 max-[640px]:w-11/12 sm:w-[30rem] lg:w-[35rem]">
        <h1 className="text-center mb-7 text-2xl font-bold tracking-wide">
          Penghitung Kalori & Gula Harian
        </h1>
        <form className="mx-12" onSubmit={(e) => handleCalculateCalories(e)}>
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
                  className="cursor-pointer"
                  onChange={handleValueInput}
                  checked={mustFilled.gender === "male"}
                />
                <label htmlFor="gender">Pria</label>

                <input
                  type="radio"
                  value="female"
                  id="gender"
                  className="cursor-pointer"
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
              htmlFor="age"
            >
              <input
                type="number"
                id="age"
                className="inputField peer"
                onChange={handleValueInput}
                value={mustFilled.age}
                maxLength={2}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Tinggi Badan (cm)"
              srcImg="/images/pageCalculateCalories/height.png"
              altImg="height"
              htmlFor="height"
            >
              <input
                type="number"
                id="height"
                className="inputField peer"
                onChange={handleValueInput}
                value={mustFilled.height}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Berat Badan (kg)"
              srcImg="/images/pageCalculateCalories/weight.png"
              altImg="weight"
              htmlFor="weight"
            >
              <input
                type="number"
                id="weight"
                className="inputField peer"
                onChange={handleValueInput}
                value={mustFilled.weight}
              />
            </ComponentInput>

            <div>
              <div className="flex gap-x-3 mb-3 items-center">
                <Image
                  width={200}
                  height={200}
                  src="/images/pageCalculateCalories/activity.png"
                  alt="activity"
                  className="size-8"
                />
                <label
                  htmlFor="activityLevel"
                  className="inline-block text-lg font-semibold"
                >
                  Activity Level
                </label>
              </div>
              <Select
                value={mustFilled.activityLevel}
                onValueChange={(value) => {
                  setSelectedValueActivityLevel(value);
                  handleValueInput({
                    target: {
                      id: "activityLevel",
                      value: value,
                    },
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tingkat Aktivitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tingkat Aktivitas</SelectLabel>
                    <SelectItem value="sedentary">
                      Tidak Aktif (Tidak Melakukan Aktifitas Berat)
                    </SelectItem>
                    <SelectItem value="lightlyActive">
                      Aktif (olahraga ringan 1-3 hari per minggu)
                    </SelectItem>
                    <SelectItem value="moderatelyActive">
                      Cukup Aktif (olahraga sedang 3-5 hari per minggu)
                    </SelectItem>
                    <SelectItem value="veryActive">
                      Sangat Aktif (olahraga keras 6-7 hari per minggu)
                    </SelectItem>
                    <SelectItem value="extraActive">
                      Extra Aktif (olahraga sangat keras / pekerjaan fisik)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="submit"
                disabled={!isFormFilled()}
                className="disabled:cursor-not-allowed mt-5 py-1 text-center rounded-md bg-[#54C392] hover:bg-green-500 cursor-pointer font-semibold tracking-wide px-7 text-lg"
              >
                Hitung
              </button>
            </DialogTrigger>
            {!errorCalculation && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Maksimal Konsumsi Gula</DialogTitle>
                  <div className="flex items-center gap-x-4">
                    <Image
                      src="/images/check.png"
                      alt="check"
                      width={200}
                      height={200}
                      className="bg-white rounded-full size-14"
                    />
                    <DialogDescription className="flex flex-col gap-y-1 tracking-wide">
                      <span>
                        Total Kalori Kamu{" "}
                        <span className="font-bold text-[#54C392] text-lg">
                          {TDEE.toLocaleString("id-ID", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          kcal
                        </span>
                      </span>
                      <span>
                        <span className="font-bold text-[#54C392] text-lg">
                          {yourMaxSugar.toLocaleString("id-ID", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          Gram
                        </span>{" "}
                        Gula per Hari
                      </span>
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <Button
                    onClick={() => setIsValidCalculation(true)}
                    className="bg-[#54C392] hover:bg-green-500 text-black"
                  >
                    Oke
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </form>
      </div>
    </div>
  );
}
