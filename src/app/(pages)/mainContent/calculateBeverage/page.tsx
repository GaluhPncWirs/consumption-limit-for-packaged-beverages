"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import MainContentLayout from "@/layout/mainSystem/content";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  BottleWine,
  Candy,
  ExternalLink,
  GlassWater,
  Info,
  Lightbulb,
  Loader2,
  Package,
  PlayIcon,
  Search,
  Sparkles,
  Tags,
} from "lucide-react";
import { getConvertMaxSugar } from "@/app/hooks/getConvertMaxSugar";
import FloatingLabel from "@/components/floating-label/component";
import { Button } from "@/components/ui/button";
import { SugarLimitStatus } from "@/components/sugarLimitStatus/component";
import ResultVisualization from "@/components/resultVisualization/component";
import { z } from "zod";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDataFunFact } from "@/services/firebase/dataFunFacts/service";
import { getDataVideoEducations } from "@/services/firebase/dataVideoEducations/service";
import { getDataRelatedJournals } from "@/services/firebase/dataRelatedJournal/service";
import Script from "next/script";

const searchKeywordSchema = z.object({
  searchKeyword: z.string().min(3, "Minimal 3 karakter"),
});

type searchKeyworSchema = z.infer<typeof searchKeywordSchema>;

type DataBeverage = {
  id: string;
  nameProduct: string;
  nameProductLowerCase: string;
  sugars: number;
  type: "Siap Minum" | "Harus Dilarutkan";
  volume: number;
};

type ResultCalculation = {
  fullBottles: number;
  remainingMl: number;
  remainingPercentage: number;
  fillBottles: number[];
  sugarPerBottle: number;
  totalConsumptionMl: number;

  funFact: {
    funFact: string;
    id: string;
    randomNumber: number;
  };
  relatedJournal: {
    id: string;
    kalimatEdukasi: string;
    linkEdukasi: string;
    randomNumber: number;
    sumberReferensi: string;
  };
  videoEducation: {
    id: string;
    linkVideo: string;
    randomNumber: number;
    sumber: string;
    sumberReferensiVideo: string;
  };
};

export default function CalculateBeverages() {
  const pathname = usePathname();
  const [searchResult, setSearchResult] = useState<DataBeverage[]>([]);
  const [resultCalculation, setResultCalculation] =
    useState<ResultCalculation | null>(null);
  const [maksimalGulaHarianPengguna, setMaksimalGulaHarianPengguna] =
    useState<number>(0);
  const [nameProduct, setNameProduct] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<DataBeverage | null>(
    null,
  );
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<searchKeyworSchema>({
    resolver: zodResolver(searchKeywordSchema),
  });
  const keyword = watch("searchKeyword");
  const visibleBottles = resultCalculation?.fillBottles.slice(0, 2);
  const remainingBottles = Math.max(
    (resultCalculation?.fillBottles?.length ?? 0) - 2,
    0,
  );

  useEffect(() => {
    async function decodeToken() {
      try {
        const req = await fetch("/api/tokenJWT/decodeTokenJWT");
        const res = await req.json();
        if (res.status) {
          setMaksimalGulaHarianPengguna(res.data.result);
        }
      } catch (err) {
        console.log("Gagal decode token", err);
      }
    }
    decodeToken();
  }, []);

  useEffect(() => {
    reset({
      searchKeyword: nameProduct,
    });
  }, [nameProduct]);

  useEffect(() => {
    if (!keyword) return;

    async function handleSearchNameBeverage() {
      try {
        const req = await fetch("/api/pageCalculate/getDataBeverage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword: keyword,
          }),
        });

        const res = await req.json();

        setSearchResult(res.data);
      } catch {
        toast.error("Gagal fetch data ke API");
      }
    }
    handleSearchNameBeverage();
  }, [keyword]);

  async function onSubmit() {
    if (!selectedProduct) return;

    const totalSugar = Number(selectedProduct.sugars);
    const volumePerBottle = Number(selectedProduct.volume);
    const maxDailySugar = Number(maksimalGulaHarianPengguna);

    // ============================================
    // Validation
    // ============================================

    if (
      !Number.isFinite(totalSugar) ||
      !Number.isFinite(volumePerBottle) ||
      !Number.isFinite(maxDailySugar) ||
      totalSugar <= 0 ||
      volumePerBottle <= 0 ||
      maxDailySugar <= 0
    ) {
      return;
    }

    // ============================================
    // 1. Gula per 1 ml
    // ============================================

    const sugarPerMl = totalSugar / volumePerBottle;

    // ============================================
    // 2. Total volume minuman yang masih dapat
    //    dikonsumsi berdasarkan batas gula
    // ============================================

    const maxConsumptionMl = maxDailySugar / sugarPerMl;

    // ============================================
    // 3. Jumlah botol penuh
    // ============================================

    const fullBottles = Math.floor(maxConsumptionMl / volumePerBottle);

    // ============================================
    // 4. Sisa volume yang masih dapat dikonsumsi
    // ============================================

    const remainingMl = Math.round(
      maxConsumptionMl - fullBottles * volumePerBottle,
    );

    // ============================================
    // 5. Persentase botol terakhir
    // ============================================

    const remainingPercentage = Math.round(
      (remainingMl / volumePerBottle) * 100,
    );

    // ============================================
    // 6. Visualisasi botol
    // ============================================

    const fillArray: number[] = Array(fullBottles).fill(100);

    if (remainingPercentage > 0) {
      fillArray.push(remainingPercentage);
    }

    // ============================================
    // 7. data pendukung
    // ============================================

    const dataFunFact = await getDataFunFact();
    const dataRelatedJournals = await getDataRelatedJournals();
    const dataVideoEducations = await getDataVideoEducations();

    // ============================================
    // 8. set hasil perhitungan
    // ============================================

    if (
      !dataFunFact.data ||
      !dataRelatedJournals.data ||
      !dataVideoEducations.data
    )
      return;

    const result: ResultCalculation = {
      fullBottles,
      remainingMl,
      remainingPercentage,
      fillBottles: fillArray,
      sugarPerBottle: totalSugar,
      totalConsumptionMl: Math.round(maxConsumptionMl),

      funFact: dataFunFact.data as ResultCalculation["funFact"],
      relatedJournal:
        dataRelatedJournals.data as ResultCalculation["relatedJournal"],
      videoEducation:
        dataVideoEducations.data as ResultCalculation["videoEducation"],
    };

    setResultCalculation(result);
  }

  function handleItemClick(item: DataBeverage) {
    setSelectedProduct(item);
    setNameProduct(item.nameProduct);
    setIsOpenSearchProduct(false);
  }

  useEffect(() => {
    if (keyword === "") {
      setSelectedProduct(null);
      setIsOpenSearchProduct(true);
    }
  }, [keyword]);

  function getConsumptionMessage() {
    const unit = selectedProduct?.type === "Siap Minum" ? "botol" : "gelas";

    // Tidak dapat mengonsumsi satu unit penuh
    if (
      resultCalculation?.fullBottles === 0 &&
      resultCalculation.remainingMl > 0
    ) {
      return (
        <span>
          Kamu dapat mengonsumsi maksimal{" "}
          <strong>{resultCalculation.remainingMl} ml</strong> atau sekitar{" "}
          <strong>{resultCalculation?.remainingPercentage}%</strong> dari 1{" "}
          {unit}.
        </span>
      );
    }

    // Hanya dapat mengonsumsi unit penuh tanpa sisa
    if (
      (resultCalculation?.fullBottles ?? 0) > 0 &&
      (resultCalculation?.remainingMl ?? 0) === 0
    ) {
      return (
        <span>
          Kamu dapat mengonsumsi maksimal{" "}
          <strong>
            {resultCalculation?.fullBottles} {unit}
          </strong>
          .
        </span>
      );
    }

    // Dapat mengonsumsi unit penuh + sebagian unit berikutnya
    if (
      (resultCalculation?.fullBottles ?? 0) > 0 &&
      (resultCalculation?.remainingMl ?? 0) > 0
    ) {
      return (
        <span>
          Kamu dapat mengonsumsi maksimal{" "}
          <strong>
            {resultCalculation?.fullBottles} {unit}
          </strong>{" "}
          penuh, ditambah maksimal{" "}
          <strong>{resultCalculation?.remainingMl} ml</strong> dari {unit}{" "}
          berikutnya.
        </span>
      );
    }

    return null;
  }

  return (
    <MainContentLayout path={pathname}>
      <div className="flex flex-col justify-center p-7 rounded-lg bg-[#f9fff9] shadow-lg shadow-slate-700">
        <div className="border-b border-slate-400 px-5 pb-5 pt-3 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Heading */}
            <div>
              <p className="mb-1 text-sm font-medium text-emerald-600">
                Konsumsi Harian
              </p>

              <h1 className="text-2xl font-bold tracking-wide text-slate-900">
                Hitung Konsumsi Minuman
              </h1>

              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                Pilih minuman untuk mengetahui seberapa banyak yang bisa kamu
                konsumsi.
              </p>
            </div>

            {/* Sugar Status */}
            <SugarLimitStatus
              consumed={selectedProduct?.sugars || 0}
              limit={getConvertMaxSugar(maksimalGulaHarianPengguna)}
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 relative">
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 mb-5">
              <Command className="pt-2">
                <FloatingLabel
                  type="text"
                  id="search"
                  label="Cari Produk Minuman"
                  Icon={Search}
                  placeholder=" "
                  register={register("searchKeyword")}
                  error={
                    errors.searchKeyword as unknown as FieldError | undefined
                  }
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Cari berdasarkan nama produk atau merek minuman
                </p>
                {isOpenSearchProduct && (
                  <div>
                    {keyword !== "" && (
                      <CommandList className="absolute w-1/2 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        {searchResult.length > 0 ? (
                          <CommandGroup heading="Pilih Produk Minuman">
                            {searchResult.map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => handleItemClick(item)}
                                className="cursor-pointer mb-1"
                              >
                                {item.nameProduct}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>Produk Tidak Ada.</CommandEmpty>
                        )}
                      </CommandList>
                    )}
                  </div>
                )}
              </Command>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Detail Produk
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Informasi produk yang kamu pilih
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3 text-sm">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                          <Package className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Nama Produk
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {selectedProduct?.nameProduct || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3 text-sm">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <GlassWater className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Isi Bersih
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {selectedProduct?.volume
                          ? `${selectedProduct?.volume} ml`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3 text-sm">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                          <Candy className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Kandungan Gula
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {selectedProduct?.sugars
                          ? `${selectedProduct?.sugars} g`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3 text-sm">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Tags className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Tipe Minuman
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {selectedProduct?.type || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-right text-muted-foreground">
                Produk yang di cari tidak ada?{" "}
                <Link
                  href="/mainContent/addProduct"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  klik disini
                </Link>{" "}
                untuk menambahkan produk
              </p>
            </div>

            <Button
              type="submit"
              disabled={!selectedProduct}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Hitung Konsumsi Gula
              <ArrowRight className="size-5" />
            </Button>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Visualisasi Konsumsi
                </h2>

                <p className="text-xs text-muted-foreground">
                  Gambaran konsumsi berdasarkan batas gula harianmu.
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <>
                {/* Main Message */}
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm font-medium leading-6 text-slate-700">
                    {getConsumptionMessage()}
                  </p>

                  <div className="mt-3 flex gap-2 border-t border-slate-300 pt-3">
                    <Info className="mt-0.5 size-4 shrink-0 text-red-500" />

                    <p className="text-xs leading-5 text-slate-500">
                      Perhitungan ini mengasumsikan kamu belum mengonsumsi gula
                      dari makanan atau minuman lain hari ini.
                    </p>
                  </div>
                </div>

                {/* Bottle Visualization */}
                <div className="mt-8">
                  <div className="flex min-h-[220px] flex-wrap items-end justify-center gap-x-5 gap-y-6">
                    {(visibleBottles ?? []).map((item: number, i: number) => (
                      <ResultVisualization
                        key={i}
                        percentage={item}
                        index={i}
                        typeBeverage={selectedProduct?.type || "Siap Minum"}
                      />
                    ))}

                    {remainingBottles > 0 && (
                      <div className="flex items-center justify-center pb-5">
                        <div className="rounded-full bg-slate-100 px-3 py-1.5">
                          <span className="text-xs font-semibold text-slate-500">
                            +{remainingBottles} lainnya
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Empty State
              <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 shadow-sm">
                  <BottleWine className="size-8" />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-700">
                  Belum ada produk dipilih
                </h3>

                <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                  Pilih produk minuman terlebih dahulu untuk melihat gambaran
                  konsumsi gula harianmu.
                </p>

                <div className="mt-5 flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 text-xs font-medium text-emerald-600 shadow-sm">
                  <Search className="size-3.5" />
                  Cari produk di sebelah kiri
                </div>
              </div>
            )}
          </div>
        </div>

        {isSubmitted && (
          <section className="mt-8 border-t border-slate-400 pt-8">
            <div className="space-y-6">
              {/* Section Header */}
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Lightbulb className="size-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                      Edukasi untuk kamu
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                      Kenali lebih jauh tentang konsumsi gula harian.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-100 p-5 sm:p-6">
                {/* Decorative */}
                <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-200/70" />

                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-600" />

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Fun Fact
                    </span>
                  </div>

                  <p className="max-w-3xl text-sm font-medium leading-7 text-slate-700 sm:text-base">
                    {resultCalculation?.funFact.funFact}
                  </p>
                </div>
              </div>

              {/* Article + Video */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Article */}
                <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <BookOpen className="size-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        Berdasarkan Sumber Artikel
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Informasi berdasarkan sumber terpercaya.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="text-sm leading-7 text-slate-600">
                      {resultCalculation?.relatedJournal.kalimatEdukasi}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-300 pt-4">
                    <p className="text-xs text-slate-400">Sumber referensi</p>

                    <a
                      href={resultCalculation?.relatedJournal.linkEdukasi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      {resultCalculation?.relatedJournal.sumberReferensi}

                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </article>

                {/* Video */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm min-h-96">
                  {/* Video Header */}
                  <div className="flex items-center gap-3 p-5 sm:p-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                      <PlayIcon className="size-5 fill-current" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                        Video Edukasi
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Pelajari lebih lanjut melalui video.
                      </p>
                    </div>
                  </div>

                  {/* Video */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    {!resultCalculation?.videoEducation ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="size-7 shrink-0 animate-spin" />
                      </div>
                    ) : (
                      <div>
                        {resultCalculation?.videoEducation.sumber ===
                        "Youtube" ? (
                          <div className="relative aspect-[16/9] max-h-[460px] overflow-hidden rounded-xl">
                            <iframe
                              title="Video edukasi tentang konsumsi gula"
                              src={`https://www.youtube.com/embed/${resultCalculation?.videoEducation.linkVideo}`}
                              className="absolute inset-0 size-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        ) : resultCalculation?.videoEducation.sumber ===
                          "Instagram" ? (
                          <>
                            <Script
                              src="https://www.instagram.com/embed.js"
                              strategy="lazyOnload"
                            />

                            <div className="overflow-hidden rounded-xl">
                              <blockquote
                                className="instagram-media m-auto"
                                data-instgrm-permalink={
                                  resultCalculation.videoEducation.linkVideo
                                }
                                data-instgrm-version="14"
                              />
                            </div>
                          </>
                        ) : null}

                        <div className="mt-5 border-t border-slate-300 pt-4">
                          <p className="text-xs text-slate-400">
                            Sumber referensi
                          </p>

                          <a
                            href={`${resultCalculation.videoEducation.sumber === "Youtube" ? `https://www.youtube.com/shorts/${resultCalculation?.videoEducation.linkVideo}` : `https://www.instagram.com/reel/DEzgKEWBXBa/?utm_source=ig_web_copy_link`}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                          >
                            {
                              resultCalculation?.videoEducation
                                .sumberReferensiVideo
                            }

                            <ExternalLink className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainContentLayout>
  );
}
