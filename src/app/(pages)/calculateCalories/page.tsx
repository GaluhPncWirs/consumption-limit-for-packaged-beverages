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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  PersonStanding,
  Ruler,
  Scale,
  UserRound,
} from "lucide-react";
import { getConvertMaxSugar } from "../../hooks/getConvertMaxSugar";
import FloatingLabel from "@/components/floating-label/component";
import { activityLevels } from "@/data-ui/calculate-page/data-activity";
import { SelectOption } from "@/components/optionCard/component";
import { genderOptions } from "@/data-ui/calculate-page/gender-option";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const dataPersonalUserSchema = z.object({
  jenisKelamin: z.enum(["male", "female"], {
    message: "Pilih jenis kelamin terlebih dahulu",
  }),
  usia: z.coerce
    .number()
    .int("Usia harus berupa angka bulat")
    .min(1, "Usia minimal 1 tahun")
    .max(99, "Usia maksimal 99 tahun"),
  tinggiBadan: z.coerce
    .number()
    .int("Tinggi badan harus berupa angka bulat")
    .min(5, "Tinggi badan minimal 5 cm")
    .max(999, "Tinggi badan maksimal 999 cm"),
  beratBadan: z.coerce
    .number()
    .min(1, "Berat badan minimal 1 kg")
    .max(999, "Berat badan maksimal 999 kg"),
  tingkatAktifitas: z
    .string()
    .min(1, "Pilih tingkat aktifitas terlebih dahulu"),
});

type DataPersonalUserSchema = z.infer<typeof dataPersonalUserSchema>;

type CalculateResult = {
  totalDailyEnergyExpenditure: number;
  resultTotalMaxSugar: number;
};

export default function InputCalculateCalories() {
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [resultCalculate, setResultCalculate] =
    useState<CalculateResult | null>(null);
  const { push } = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DataPersonalUserSchema>({
    resolver: zodResolver(dataPersonalUserSchema),
  });

  const selectedGender = watch("jenisKelamin");

  function handleResultCalculate(
    data: DataPersonalUserSchema,
  ): CalculateResult | null {
    let basalMetabolicRate: number;

    if (data.jenisKelamin === "male") {
      basalMetabolicRate =
        10 * data.beratBadan + 6.25 * data.tinggiBadan - 5 * data.usia + 5;
    } else {
      basalMetabolicRate =
        10 * data.beratBadan + 6.25 * data.tinggiBadan - 5 * data.usia - 161;
    }

    let choosenActivityLevel: number;

    switch (data.tingkatAktifitas) {
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
      basalMetabolicRate * choosenActivityLevel;
    const resultTotalCalorie = totalDailyEnergyExpenditure * 0.1;
    const resultTotalMaxSugar = resultTotalCalorie / 4;

    if (resultTotalMaxSugar < 5 || resultTotalMaxSugar > 100) {
      toast("Perhitungan Tidak Valid ❌", {
        description:
          "Hasilnya Tidak Memenuhi Standar, Silahkan Input Kembali !",
      });
      return null;
    }

    return {
      totalDailyEnergyExpenditure,
      resultTotalMaxSugar,
    };
  }

  async function onSubmit(data: DataPersonalUserSchema) {
    const result = handleResultCalculate(data);
    setResultCalculate(result);
    setOpenResultDialog(true);
  }

  async function handleContinue() {
    if (!resultCalculate) return;

    try {
      const req = await fetch("/api/tokenJWT/resultCalories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resultCalculate: resultCalculate.resultTotalMaxSugar,
        }),
      });

      const response = await req.json();

      if (response.status !== "success") {
        toast("❌ Gagal", {
          description: "Gagal menyimpan hasil kalkulasi",
        });

        return;
      }

      toast("✅ Berhasil", {
        description: "Lanjut ke halaman perhitungan konsumsi minuman",
      });

      push("/mainContent/calculateBeverage");
    } catch {
      toast("❌ Gagal", {
        description: "Fetch API error",
      });
    }
  }

  return (
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
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Gender */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserRound className="size-5 shrink-0" />
                <span className="text-sm font-semibold text-slate-700 tracking-wide">
                  Jenis Kelamin
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <SelectOption
                    key={option.value}
                    option={option}
                    isSelected={selectedGender === option.value}
                    register={register("jenisKelamin")}
                  />
                ))}
                {errors.jenisKelamin && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.jenisKelamin.message}
                  </p>
                )}
              </div>
            </div>

            {/* Physical Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-5">
                <PersonStanding className="size-6 shrink-0" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-700 tracking-wide">
                    Informasi Tubuh
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Masukkan data tubuhmu untuk mendapatkan hasil yang lebih
                    akurat.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Age */}
                <div className="space-y-2">
                  <FloatingLabel
                    type="number"
                    id="age"
                    label="Usia"
                    desc="tahun"
                    Icon={CalendarDays}
                    placeholder=" "
                    register={register("usia")}
                    error={errors.usia}
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <FloatingLabel
                    type="number"
                    id="height"
                    label="Tinggi"
                    desc="cm"
                    Icon={Ruler}
                    placeholder=" "
                    register={register("tinggiBadan")}
                    error={errors.tinggiBadan}
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <FloatingLabel
                    type="number"
                    id="weight"
                    label="Berat"
                    desc="kg"
                    Icon={Scale}
                    placeholder=" "
                    register={register("beratBadan")}
                    error={errors.beratBadan}
                  />
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-slate-500" />

                <label
                  htmlFor="activityLevel"
                  className="text-sm font-semibold text-slate-700 tracking-wide"
                >
                  Tingkat Aktivitas
                </label>
              </div>

              <Controller
                control={control}
                name="tingkatAktifitas"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <>
                      <SelectTrigger className="h-12 rounded-xl px-4 text-sm font-medium shadow-none transition hover:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                        <SelectValue placeholder="Pilih tingkat aktivitas" />
                      </SelectTrigger>
                      {errors.tingkatAktifitas && (
                        <p className="text-red-500 text-xs mt-0.5">
                          {errors.tingkatAktifitas.message}
                        </p>
                      )}
                    </>

                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {activityLevels.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-2">
                              <item.icon className="size-4" />
                              <span>
                                {item.label} - {item.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Submit */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-slate-50 tracking-wide shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  Hitung Kalori & Gula
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader className="flex flex-row items-center gap-3">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="size-7 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-lg text-start">
                      Hasil Perhitungan
                    </DialogTitle>

                    <DialogDescription className="pt-1 text-sm text-start">
                      Berdasarkan data tubuh dan aktivitas yang kamu masukkan.
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <div className="space-y-3 py-3">
                  {/* Calories */}
                  <div className="rounded-xl border border-slate-100 bg-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Total Kalori Harian
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      {getConvertMaxSugar(
                        resultCalculate?.totalDailyEnergyExpenditure,
                      )}
                      <span className="ml-1 text-sm font-medium text-slate-500">
                        kcal
                      </span>
                    </p>
                  </div>

                  {/* Sugar */}
                  <div className="rounded-xl border border-slate-100 bg-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Batas Gula Harian
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      {getConvertMaxSugar(resultCalculate?.resultTotalMaxSugar)}
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

                  <Button
                    className="rounded-xl bg-emerald-500 text-slate-50 tracking-wide hover:bg-emerald-600"
                    type="button"
                    onClick={handleContinue}
                  >
                    Lanjut
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
          <p className="text-xs px-7 text-right mb-5 text-muted-foreground">
            Hasil perhitungan merupakan estimasi dan bisa berbeda pada setiap
            orang
          </p>
        </div>
      </div>

      {isSubmitting && <LoadingCompenent />}
    </div>
  );
}
