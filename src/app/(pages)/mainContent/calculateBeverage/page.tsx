"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useHandleInput } from "../../../hooks/getIsFormFilled";
import {
  educationsForArtikel,
  educationsForFunfactSugar,
  educationsForVideo,
  productBeverageTypes,
} from "@/types/dataTypes";
import {
  subscribeToFunFactSugars,
  subscribeToProducts,
  subscribeToReleatedArtikel,
  subscribeToVideoEducation,
} from "@/lib/firebase/services";
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
  Candy,
  CupSoda,
  ExternalLink,
  GlassWater,
  Info,
  Lightbulb,
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

export default function CalculateBeverages() {
  const pathname = usePathname();
  const [fillBottle, setFillBottle] = useState<number[]>([]);
  const [searchResult, setSearchResult] = useState<DataBeverage[]>([]);
  const [totalBotol, setTotalBotol] = useState<number>(0);
  const [maksimalGulaHarianPengguna, setMaksimalGulaHarianPengguna] =
    useState<number>(0);
  const [nameProduct, setNameProduct] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<DataBeverage | null>(
    null,
  );
  const [funFactSugar, setFunFactSugar] = useState<string[]>([]);
  const [video, setVideo] = useState<educationsForVideo[]>([]);
  const [remainingMl, setRemainingMl] = useState<number>(0);
  const [artikel, setArtikel] = useState<educationsForArtikel[]>([]);
  const [typeProduct, setTypeProduct] = useState<string>("");
  const [fillLess100, setFillLess100] = useState<number>(0);
  const [messageIfDrinkSomeBottles, setMessageIfDrinkSomeBottles] = useState({
    botol: 0,
    sisaGula: 0,
  });
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<searchKeyworSchema>({
    resolver: zodResolver(searchKeywordSchema),
  });

  const keyword = watch("searchKeyword");

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

  //     if (funFactSugar.length > 0 && video.length > 0) {
  //   setFunFactSugar((prev) => [...prev.sort(() => Math.random() - 0.5)]);
  //   setVideo((prev) => [...prev.sort(() => Math.random() - 0.5)]);
  //   setArtikel((prev) => [...prev.sort(() => Math.random() - 0.5)]);
  // }
  async function onSubmit(data: searchKeyworSchema) {
    if (!selectedProduct) return;

    const kandunganGulaDidalamProduk = selectedProduct.sugars;
    const totalIsiMinuman = selectedProduct.volume;

    const gulaPerSatuML = kandunganGulaDidalamProduk / totalIsiMinuman; //ubah total gula menjadi per 1 ml

    // menghitung jumalah botol yang datap dikonsumsi
    const maxKonsumsiPerMl = maksimalGulaHarianPengguna / gulaPerSatuML;
    // hasilnya dibulatkan kebawah
    const numberOfBottles = Math.floor(maxKonsumsiPerMl / totalIsiMinuman);
    setTotalBotol(numberOfBottles);

    let displayBottle = Math.round(numberOfBottles / 2);
    if (displayBottle < 1) {
      displayBottle = 1;
    }

    // untuk sisa gula
    const sugarPerBotol = gulaPerSatuML * totalIsiMinuman;
    const totalSugarConsume = sugarPerBotol * displayBottle;
    const remainingSugar = maksimalGulaHarianPengguna - totalSugarConsume;

    setMessageIfDrinkSomeBottles(
      (prev: { botol: number; sisaGula: number }) => ({
        ...prev,
        botol: displayBottle,
        sisaGula: Math.round(remainingSugar),
      }),
    );

    // menghitung sisa konsumsi
    const remaining = maxKonsumsiPerMl % totalIsiMinuman;
    // sisa tersebut dikonversi ke dalam persen
    const percentageFillForRemaining = Math.round(
      (remaining / totalIsiMinuman) * 100,
    );
    // jumlah botol diubah menjadi array yang diisi 100 disetiap botol yang ada
    const fillArray: number[] = Array(numberOfBottles).fill(100);
    // jika terdapat sisa maka array "jumlahBotol" diisi oleh variabel ini "berapaPersenYangTersedia"
    if (percentageFillForRemaining > 0) {
      fillArray.push(percentageFillForRemaining);
    }
    setFillBottle(fillArray);
    setRemainingMl(Math.round(remaining));
    setFillLess100(percentageFillForRemaining);
  }

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

  function getConsumtionMessage() {
    if (fillBottle.length > 1 && fillLess100 < 100 && remainingMl !== 0) {
      return (
        <span>
          Bisa Konsumsi Maksimal {fillBottle.length}{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"} {remainingMl} ml
        </span>
      );
    } else if (
      fillBottle.length === 1 &&
      fillLess100 < 100 &&
      fillLess100 !== 0
    ) {
      return (
        <span>
          Maksimal Bisa Dikonsumsi {remainingMl} ml, hanya 1{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </span>
      );
    } else {
      return (
        <span>
          Bisa Konsumsi Maksimal {fillBottle.length}{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </span>
      );
    }
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
              consumed={42}
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
                      <CommandList
                        className="absolute w-1/2 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-xl
"
                      >
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
                    <div className="flex justify-between items-center gap-3">
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
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <CupSoda className="size-6" />
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
                    <div className="flex justify-between items-center gap-3">
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
                    <div className="flex justify-between items-center gap-3">
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
              // disabled={!selectedProduct}
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
                    {getConsumtionMessage()}
                  </p>

                  <div className="mt-3 flex gap-2 border-t border-emerald-100 pt-3">
                    <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />

                    <p className="text-xs leading-5 text-slate-500">
                      Perhitungan ini mengasumsikan kamu belum mengonsumsi gula
                      dari makanan atau minuman lain hari ini.
                    </p>
                  </div>
                </div>

                {/* Bottle Visualization */}
                <div className="mt-8">
                  <div className="flex min-h-[220px] flex-wrap items-end justify-center gap-x-6 gap-y-8">
                    {fillBottle.map((item: number, i: number) => (
                      <ResultVisualization
                        key={i}
                        percentage={item}
                        index={i}
                        typeBeverage={selectedProduct?.type}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-amber-400 shadow-sm">
                  <GlassWater className="size-8" />
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
                    {funFactSugar[0]}
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
                      {artikel[0]?.kalimatEdukasi}
                    </p>
                  </div>

                  {artikel[0]?.linkEdukasi && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">Sumber referensi</p>

                      <a
                        href={artikel[0]?.linkEdukasi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                      >
                        {artikel[0]?.sumberReferensi}

                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )}
                </article>

                {/* Video */}
                {video[0]?.sumber && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                      {video[0]?.sumber === "Youtube" ? (
                        <div className="relative aspect-[9/16] max-h-[460px] overflow-hidden rounded-xl bg-slate-100">
                          <iframe
                            title="Video edukasi tentang konsumsi gula"
                            src={`https://www.youtube.com/embed/${video[0]?.linkVideo}`}
                            className="absolute inset-0 size-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : video[0]?.sumber === "Instagram" ? (
                        <div className="overflow-hidden rounded-xl bg-slate-100">
                          <blockquote
                            className="instagram-media m-auto"
                            data-instgrm-permalink={video[0]?.linkVideo}
                            data-instgrm-version="14"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </MainContentLayout>
  );
}
