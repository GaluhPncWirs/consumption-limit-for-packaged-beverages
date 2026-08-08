"use client";
import { useEffect, useState } from "react";
import { useHandleInput } from "../../hooks/getIsFormFilled";
import Image from "next/image";
import ComponentInput from "@/layout/input/content";
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
import LoadingCompenent from "@/components/loading/content";
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
  Activity,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  Ruler,
  Scale,
  UserRound,
} from "lucide-react";
import { getConvertMaxSugar } from "../../hooks/getConvertMaxSugar";
import { Input } from "@/components/ui/input";

export default function InputCalculateCalories() {
  const [selectedValueActivityLevel, setSelectedValueActivityLevel] =
    useState<string>("");
  const [isValidCalculation, setIsValidCalculation] = useState<boolean>(false);
  const [isErrorCalculation, setIsErrorCalculation] = useState<boolean>(false);
  const [yourMaxSugar, setYourMaxSugar] = useState<number>(0);
  const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false);
  const [TDEE, setTDEE] = useState<number>(0);
  const { push } = useRouter();

  const { mustFilled, handleValueInput, isFormFilled } = useHandleInput({
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
  });

  function handleCalculateCalories(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const targetValue = event.target as HTMLFormElement;

    const gender = targetValue.gender.value;
    const age = Number(targetValue.age.value);
    const heightBody = Number(targetValue.height.value);
    const weightBody = Number(targetValue.weight.value);

    const maxLengthAge = targetValue.age.value.length;
    const maxLengthHeight = targetValue.height.value.length;
    const maxLengthWeight = targetValue.weight.value.length;

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
      toast("❌ Perhitungan Tidak Valid", {
        description:
          "Hasilnya tidak memenuhi standar, silahkan input kembali !",
      });
      setIsErrorCalculation(true);
    } else {
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

      if (resultTotalMaxSugar < 5 || resultTotalMaxSugar > 100) {
        setIsErrorCalculation(true);
        toast("Perhitungan Tidak Valid ❌", {
          description:
            "Hasilnya Tidak Memenuhi Standar, Silahkan Input Kembali !",
        });
      }
      setTDEE(totalDailyEnergyExpenditure);
      setYourMaxSugar(resultTotalMaxSugar);
    }
  }

  useEffect(() => {
    if (isValidCalculation) {
      async function isCalculateSuccess() {
        try {
          setLoadingNextPage(true);
          const req = await fetch("/api/tokenJWT/resultCalories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resultCalculate: yourMaxSugar }),
          });
          const response = await req.json();
          if (response.status === "success") {
            push("/mainContent/calculateBeverage");
            toast("✅ Berhasil", {
              description: "Lanjut ke halaman perhitungan konsumsi minuman",
            });
          }
        } catch {
          toast("❌ Gagal", {
            description: "Fetch API error",
          });
        } finally {
          setLoadingNextPage(false);
        }
      }
      isCalculateSuccess();
    }
  }, [isValidCalculation, yourMaxSugar, push]);

  return (
    // <div className="min-h-screen flex items-center justify-center px-4 py-8">
    //   <div className="bg-[#f9fff9] rounded-lg py-7 shadow-lg shadow-slate-700 w-11/12 sm:w-[30rem] lg:w-[35rem]">
    //     <h1 className="text-center mb-7 text-2xl font-bold tracking-wide">
    //       Penghitung Kalori & Gula Harian
    //     </h1>
    //     <form className="mx-12" onSubmit={(e) => handleCalculateCalories(e)}>
    //       <div className="flex flex-col justify-center gap-y-5">
    //         <div
    //           className="flex gap-5 items-center font-semibold"
    //           id="inputGender"
    //         >
    //           <div className="flex gap-x-4 items-center">
    //             <Image
    //               width={200}
    //               height={200}
    //               src="/images/pageCalculateCalories/gender.png"
    //               alt="gender"
    //               className="size-8"
    //               loading="eager"
    //             />
    //             <span className="text-lg">Gender</span>
    //             <input
    //               type="radio"
    //               value="male"
    //               id="gender"
    //               className="cursor-pointer"
    //               onChange={handleValueInput}
    //               checked={mustFilled.gender === "male"}
    //             />
    //             <label htmlFor="gender">Pria</label>

    //             <input
    //               type="radio"
    //               value="female"
    //               id="gender"
    //               className="cursor-pointer"
    //               onChange={handleValueInput}
    //               checked={mustFilled.gender === "female"}
    //             />
    //             <label htmlFor="gender">Wanita</label>
    //           </div>
    //         </div>

    //         <ComponentInput
    //           titleInput="Usia (tahun)"
    //           srcImg="/images/pageCalculateCalories/age.png"
    //           altImg="age"
    //           htmlFor="age"
    //         >
    //           <input
    //             type="number"
    //             id="age"
    //             className="inputField peer"
    //             onChange={handleValueInput}
    //             value={mustFilled.age}
    //             maxLength={2}
    //           />
    //         </ComponentInput>

    //         <ComponentInput
    //           titleInput="Tinggi Badan (cm)"
    //           srcImg="/images/pageCalculateCalories/height.png"
    //           altImg="height"
    //           htmlFor="height"
    //         >
    //           <input
    //             type="number"
    //             id="height"
    //             className="inputField peer"
    //             onChange={handleValueInput}
    //             value={mustFilled.height}
    //           />
    //         </ComponentInput>

    //         <ComponentInput
    //           titleInput="Berat Badan (kg)"
    //           srcImg="/images/pageCalculateCalories/weight.png"
    //           altImg="weight"
    //           htmlFor="weight"
    //         >
    //           <input
    //             type="number"
    //             id="weight"
    //             className="inputField peer"
    //             onChange={handleValueInput}
    //             value={mustFilled.weight}
    //           />
    //         </ComponentInput>

    //         <div>
    //           <div className="flex gap-x-3 mb-3 items-center">
    //             <Image
    //               width={200}
    //               height={200}
    //               src="/images/pageCalculateCalories/activity.png"
    //               alt="activity"
    //               className="size-8"
    //               loading="eager"
    //             />
    //             <label
    //               htmlFor="activityLevel"
    //               className="inline-block text-lg font-semibold"
    //             >
    //               Activity Level
    //             </label>
    //           </div>

    //           <Select
    //             defaultValue={mustFilled.activityLevel}
    //             onValueChange={(value) => {
    //               setSelectedValueActivityLevel(value);
    //               handleValueInput({
    //                 target: {
    //                   id: "activityLevel",
    //                   value: value,
    //                 },
    //               });
    //             }}
    //           >
    //             <SelectTrigger>
    //               <SelectValue placeholder="Pilih Tingkat Aktivitas" />
    //             </SelectTrigger>
    //             <SelectContent className="px-2">
    //               <SelectGroup>
    //                 <SelectLabel>Tingkat Aktivitas</SelectLabel>
    //                 <SelectItem value="sedentary">
    //                   Tidak Aktif (Tidak Melakukan Aktifitas Berat)
    //                 </SelectItem>
    //                 <SelectItem value="lightlyActive">
    //                   Aktif (olahraga ringan 1-3 hari per minggu)
    //                 </SelectItem>
    //                 <SelectItem value="moderatelyActive">
    //                   Cukup Aktif (olahraga sedang 3-5 hari per minggu)
    //                 </SelectItem>
    //                 <SelectItem value="veryActive">
    //                   Sangat Aktif (olahraga keras 6-7 hari per minggu)
    //                 </SelectItem>
    //                 <SelectItem value="extraActive">
    //                   Extra Aktif (olahraga sangat keras / pekerjaan fisik)
    //                 </SelectItem>
    //               </SelectGroup>
    //             </SelectContent>
    //           </Select>
    //         </div>
    //       </div>

    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <button
    //             type="submit"
    //             disabled={!isFormFilled}
    //             className="disabled:cursor-not-allowed mt-5 py-1 text-center rounded-md bg-[#54C392] hover:bg-green-500 cursor-pointer font-semibold tracking-wide px-7 text-lg"
    //           >
    //             Hitung
    //           </button>
    //         </DialogTrigger>
    //         {!isErrorCalculation && (
    //           <DialogContent>
    //             <DialogHeader>
    //               <DialogTitle className="mb-3">
    //                 Maksimal Konsumsi Gula
    //               </DialogTitle>
    //               <div className="flex items-center gap-x-4">
    //                 <CheckCircle className="text-green-500 size-14" />
    //                 <DialogDescription className="flex flex-col gap-y-1 tracking-wide">
    //                   <span>
    //                     Total Kalori Kamu{" "}
    //                     <span className="font-bold text-[#54C392] text-lg">
    //                       {getConvertMaxSugar(TDEE)} kcal
    //                     </span>
    //                   </span>
    //                   <span>
    //                     <span className="font-bold text-[#54C392] text-lg">
    //                       {getConvertMaxSugar(yourMaxSugar)} Gram
    //                     </span>{" "}
    //                     Gula per Hari
    //                   </span>
    //                 </DialogDescription>
    //               </div>
    //             </DialogHeader>
    //             <DialogFooter>
    //               <DialogClose asChild>
    //                 <Button variant="outline">Batal</Button>
    //               </DialogClose>
    //               <DialogClose asChild>
    //                 <Button
    //                   onClick={() => setIsValidCalculation(true)}
    //                   className="bg-[#54C392] hover:bg-green-400 text-black"
    //                 >
    //                   Oke
    //                 </Button>
    //               </DialogClose>
    //             </DialogFooter>
    //           </DialogContent>
    //         )}
    //       </Dialog>
    //     </form>
    //   </div>
    //   {loadingNextPage && <LoadingCompenent />}
    // </div>

    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          {/* Header */}
          <div className="border-b border-slate-200 p-6 sm:px-8">
            <p className="mb-1 text-sm font-medium text-emerald-600">
              Kesehatan Harian
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Penghitung Kalori & Gula
            </h1>

            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Hitung kebutuhan kalori dan batas konsumsi gula harianmu.
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-5 p-6 sm:px-8 sm:py-5"
            onSubmit={(e) => handleCalculateCalories(e)}
          >
            {/* Gender */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserRound className="size-5" />
                <span className="text-sm font-semibold text-slate-700 tracking-wide">
                  Jenis Kelamin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Male */}
                <label
                  className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
                    mustFilled.gender === "male"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Input
                    type="radio"
                    name="gender"
                    value="male"
                    className="sr-only"
                    onChange={handleValueInput}
                    checked={mustFilled.gender === "male"}
                  />

                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      mustFilled.gender === "male"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span className="text-lg">♂</span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">Pria</p>
                    <p className="text-xs text-slate-500">Laki-laki</p>
                  </div>

                  <div
                    className={`ml-auto flex size-5 items-center justify-center rounded-full border ${
                      mustFilled.gender === "male"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    }`}
                  >
                    {mustFilled.gender === "male" && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>
                </label>

                {/* Female */}
                <label
                  className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
                    mustFilled.gender === "female"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="sr-only"
                    onChange={handleValueInput}
                    checked={mustFilled.gender === "female"}
                  />

                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      mustFilled.gender === "female"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span className="text-lg">♀</span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Wanita
                    </p>
                    <p className="text-xs text-slate-500">Perempuan</p>
                  </div>

                  <div
                    className={`ml-auto flex size-5 items-center justify-center rounded-full border ${
                      mustFilled.gender === "female"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    }`}
                  >
                    {mustFilled.gender === "female" && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Physical Information */}
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Informasi Tubuh
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Masukkan data tubuhmu untuk mendapatkan hasil yang lebih
                  akurat.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Age */}
                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <CalendarDays className="size-4 text-slate-400" />
                    Usia
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      id="age"
                      min={1}
                      max={100}
                      value={mustFilled.age}
                      onChange={handleValueInput}
                      placeholder="22"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      tahun
                    </span>
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label
                    htmlFor="height"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <Ruler className="size-4 text-slate-400" />
                    Tinggi
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      id="height"
                      min={1}
                      value={mustFilled.height}
                      onChange={handleValueInput}
                      placeholder="170"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      cm
                    </span>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label
                    htmlFor="weight"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <Scale className="size-4 text-slate-400" />
                    Berat
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      id="weight"
                      min={1}
                      value={mustFilled.weight}
                      onChange={handleValueInput}
                      placeholder="65"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-slate-500" />

                <label
                  htmlFor="activityLevel"
                  className="text-sm font-semibold text-slate-700"
                >
                  Tingkat Aktivitas
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
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-medium shadow-none transition hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/10">
                  <SelectValue placeholder="Pilih tingkat aktivitas" />
                </SelectTrigger>

                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    <SelectLabel className="px-3 py-2 text-xs text-slate-400">
                      Tingkat Aktivitas
                    </SelectLabel>

                    <SelectItem value="sedentary">
                      Tidak Aktif — tidak melakukan aktivitas berat
                    </SelectItem>

                    <SelectItem value="lightlyActive">
                      Aktif Ringan — olahraga 1-3 hari/minggu
                    </SelectItem>

                    <SelectItem value="moderatelyActive">
                      Cukup Aktif — olahraga 3-5 hari/minggu
                    </SelectItem>

                    <SelectItem value="veryActive">
                      Sangat Aktif — olahraga 6-7 hari/minggu
                    </SelectItem>

                    <SelectItem value="extraActive">
                      Extra Aktif — olahraga berat / pekerjaan fisik
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="submit"
                  disabled={!isFormFilled}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  Hitung Kalori & Gula
                </button>
              </DialogTrigger>

              {!isErrorCalculation && (
                <DialogContent className="max-w-md rounded-2xl">
                  <DialogHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="size-7 text-emerald-500" />
                    </div>

                    <DialogTitle className="text-xl">
                      Hasil Perhitungan
                    </DialogTitle>

                    <DialogDescription className="pt-2">
                      Berdasarkan data tubuh dan aktivitas yang kamu masukkan.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 py-4">
                    {/* Calories */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Total Kalori Harian
                      </p>

                      <p className="mt-1 text-2xl font-bold text-emerald-600">
                        {getConvertMaxSugar(TDEE)}
                        <span className="ml-1 text-sm font-medium text-slate-500">
                          kcal
                        </span>
                      </p>
                    </div>

                    {/* Sugar */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Batas Gula Harian
                      </p>

                      <p className="mt-1 text-2xl font-bold text-emerald-600">
                        {getConvertMaxSugar(yourMaxSugar)}
                        <span className="ml-1 text-sm font-medium text-slate-500">
                          gram
                        </span>
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="rounded-xl">
                        Batal
                      </Button>
                    </DialogClose>

                    <DialogClose asChild>
                      <Button
                        onClick={() => setIsValidCalculation(true)}
                        className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        Lihat Hasil
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </form>
        </div>

        {/* Optional helper text */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Hasil perhitungan merupakan estimasi dan dapat berbeda pada setiap
          orang.
        </p>
      </div>

      {loadingNextPage && <LoadingCompenent />}
    </div>
  );
}
