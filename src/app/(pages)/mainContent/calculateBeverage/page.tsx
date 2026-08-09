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
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import ComponentInput from "@/layout/input/content";
import { Candy, ChevronUp, CupSoda, Layers3, Search } from "lucide-react";
import { getConvertMaxSugar } from "@/app/hooks/getConvertMaxSugar";
import FloatingLabel from "@/components/floating-label/component";
import { Button } from "@/components/ui/button";

export default function CalculateBeverages() {
  const pathname = usePathname();
  const [fillBottle, setFillBottle] = useState<number[]>([]);
  const [appearContent, setAppearContent] = useState<boolean>(false);
  const [totalBotol, setTotalBotol] = useState<number>(0);
  const [product, setProduct] = useState<productBeverageTypes[]>([]);
  const [maksimalGulaHarianPengguna, setMaksimalGulaHarianPengguna] =
    useState<number>(0);
  const [searchProduk, setSearchProduk] = useState<string>("");
  const [selectedProduct, setSelectedProduct] =
    useState<productBeverageTypes | null>(null);
  const [result, setResult] = useState<productBeverageTypes[]>([]);
  const [sugar, setSugar] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [servingSize, setServingSize] = useState<boolean>(false);
  const [funFactSugar, setFunFactSugar] = useState<string[]>([]);
  const [video, setVideo] = useState<educationsForVideo[]>([]);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });
  const [remainingMl, setRemainingMl] = useState<number>(0);
  const [artikel, setArtikel] = useState<educationsForArtikel[]>([]);
  const [typeProduct, setTypeProduct] = useState<string>("");
  const [fillLess100, setFillLess100] = useState<number>(0);
  const [messageIfDrinkSomeBottles, setMessageIfDrinkSomeBottles] = useState({
    botol: 0,
    sisaGula: 0,
  });
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);

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
    setMustFilled((prev: Object) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  function handleCalculateProductBeverage(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const targetValue = event.target as HTMLFormElement;

    if (result.length > 0) {
      if (funFactSugar.length > 0 && video.length > 0) {
        setFunFactSugar((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setVideo((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setArtikel((prev) => [...prev.sort(() => Math.random() - 0.5)]);
      }
      setAppearContent(true);
      const kandunganGulaDidalamProduk = parseFloat(
        targetValue.sugarContent.value,
      );
      const totalIsiMinuman = parseFloat(targetValue.isiBeratBersih.value);
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
      setTypeProduct((prev: string) => (prev === type ? prev : type));
    } else {
      toast("❌ Input Harus Sesuai", {
        description: "Tolong untuk cari produk minuman yang sudah ada !",
      });
    }
  }

  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToProducts(
      (dataProduct) => {
        setProduct(dataProduct);
      },
    );
    return () => unsubscribeDataProductBeverage();
  }, []);

  // ambil data produk minuman
  useEffect(() => {
    if (appearContent) {
      const unsubscribeDataFunFactSugar = subscribeToFunFactSugars(
        (dataFunfact) => {
          setFunFactSugar(
            dataFunfact.map(
              (getFunFact: educationsForFunfactSugar) => getFunFact.funFact,
            ),
          );
        },
      );

      const unsubscribeDataArtikel = subscribeToReleatedArtikel(
        (dataArtikel) => {
          setArtikel(dataArtikel);
        },
      );

      const unsubscribeDataVideoEducation = subscribeToVideoEducation(
        (dataVideo) => {
          setVideo(dataVideo);
        },
      );

      return () => {
        (unsubscribeDataFunFactSugar(),
          unsubscribeDataArtikel(),
          unsubscribeDataVideoEducation());
      };
    }
  }, [appearContent]);

  useEffect(() => {
    if (!type) {
      setTypeProduct(type);
    }
  }, [type]);

  function handleInputChange(value: string) {
    setSearchProduk(value);

    if (value !== "") {
      const filterSearchProduct = product.filter(
        (item: productBeverageTypes) => {
          return item.nameProduct
            ?.toLowerCase()
            .startsWith(value.toLowerCase());
        },
      );
      setResult(filterSearchProduct);
    } else {
      setResult([]);
    }
  }

  function handleItemClick(item: productBeverageTypes) {
    setSelectedProduct(item);
    setSearchProduk(item.nameProduct);
    setIsOpenSearchProduct(false);
  }

  useEffect(() => {
    if (selectedProduct) {
      setSearchProduk(selectedProduct.nameProduct);
      setSugar(selectedProduct.sugars);
      setVolume(selectedProduct.volume);
      setType(selectedProduct.type);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (searchProduk === "") {
      setSelectedProduct(null);
      setIsOpenSearchProduct(true);
    }
  }, [searchProduk]);

  function getConsumtionMessage() {
    if (fillBottle.length > 1 && fillLess100 < 100 && remainingMl !== 0) {
      return (
        <p>
          Bisa Konsumsi Maksimal {fillBottle.length}{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"} {remainingMl} ml
        </p>
      );
    } else if (
      fillBottle.length === 1 &&
      fillLess100 < 100 &&
      fillLess100 !== 0
    ) {
      return (
        <p>
          Maksimal Bisa Dikonsumsi {remainingMl} ml, hanya 1{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </p>
      );
    } else {
      return (
        <p>
          Bisa Konsumsi Maksimal {fillBottle.length}{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </p>
      );
    }
  }

  return (
    <MainContentLayout path={pathname}>
      <div className="fixed top-0 right-0 bg-green-400 p-3 rounded-bl-md shadow-md shadow-slate-700 z-20">
        <h1 className="font-semibold text-base md:text-lg tracking-wide px-2">
          Batas Gula Harian{" "}
          <span>{getConvertMaxSugar(maksimalGulaHarianPengguna)} Gram</span>
        </h1>
      </div>
      <div className="flex flex-col justify-center p-7 rounded-lg bg-[#f9fff9] mt-20 mb-12 shadow-lg shadow-slate-700">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Hitung Konsumsi Minuman
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih minuman untuk mengetahui seberapa banyak yang bisa kamu
            konsumsi.
          </p>
        </div>
        <div
          className={`mt-5 grid ${
            fillBottle.length >= 1
              ? `grid-cols-2 gap-y-5 lg:gap-x-3`
              : `grid-cols-1`
          }`}
        >
          <form
            autoComplete="off"
            onSubmit={(e) => handleCalculateProductBeverage(e)}
          >
            <div className="space-y-5">
              <Command className="pt-2">
                <FloatingLabel
                  type="text"
                  id="search"
                  label="Cari Produk"
                  Icon={Search}
                  placeholder=" "
                  // register={register("search")}
                  // error={errors.search as unknown as FieldError | undefined}
                />
                {isOpenSearchProduct && (
                  <div>
                    {searchProduk !== "" && (
                      <CommandList className="p-2 bg-slate-200 absolute z-10 w-full text-[#333333] font-medium max-h-36 overflow-y-auto rounded-b-lg">
                        {result.length > 0 ? (
                          <CommandGroup heading="Pilih Produk">
                            {result.map((item: productBeverageTypes) => (
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
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <CupSoda className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Isi Bersih
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {volume} ml
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                          <Candy className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">Gula</p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {sugar} g
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex gap-5 items-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <Layers3 className="size-6" />
                        </div>

                        <p className="font-semibold text-slate-700">
                          Tipe Minuman
                        </p>
                      </div>

                      <p className="mt-0.5 font-semibold text-slate-800">
                        {type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-right text-muted-foreground">
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
              className="disabled:cursor-not-allowed py-1.5 text-center rounded-md bg-emerald-400 hover:bg-emerald-500 cursor-pointer font-semibold tracking-wide w-full text-lg mt-7"
              disabled={!isFormFilled}
            >
              Hitung
            </Button>
          </form>

          <div className="gap-6 flex justify-center items-center flex-col md:basis-1/2 lg:basis-3/4">
            <div
              className={`${
                appearContent ? `block` : `hidden`
              } font-semibold text-lg tracking-wide max-w-md`}
            >
              {getConsumtionMessage()}
              <h2 className="text-xs text-[#F93827] mt-0.5 text-justify">
                *Disclaimer Ini hanya berlaku jika kamu belum ada asupan gula
                sama sekali di hari ini. Jika sudah ada, sebaiknya jumlahnya
                dikurangi dari yang ditampilkan.
              </h2>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-y-5">
              {fillBottle.map((item: number, i: number) =>
                typeProduct === "Siap Minum" ? (
                  <div key={i} className="bottleInside w-32">
                    <div className="fill" style={{ height: `${item}%` }}></div>
                  </div>
                ) : (
                  <div key={i} className="glassCupInside w-32">
                    <div className="fill" style={{ height: `${item}%` }}></div>
                  </div>
                ),
              )}
            </div>
            {totalBotol >= 1 && (
              <h1 className="text-sm tracking-wide font-semibold text-justify max-w-md">
                {`Jika Kamu Mengkonsumsi Hanya ${messageIfDrinkSomeBottles.botol} Botol Maka Sisa Dari Gula
                  Harian Kamu Adalah ${messageIfDrinkSomeBottles.sisaGula} Gram`}
              </h1>
            )}
          </div>
        </div>

        {appearContent === true && (
          <div className="flex justify-center items-center flex-col mt-7 gap-y-7">
            <div className="basis-1/2 flex flex-col gap-y-3">
              <div>
                <h1 className="font-semibold text-xl mb-1 tracking-wide">
                  Fun Fact
                </h1>
                <p className="font-medium text-justify">{funFactSugar[0]}</p>
              </div>
              <div>
                <h1 className="font-semibold text-xl mb-1 tracking-wide">
                  Berdasarkan Sumber Artikel
                </h1>
                <p className="font-medium text-justify">
                  {artikel[0]?.kalimatEdukasi}
                </p>
                <p className="mt-1">
                  — Baca Selengkapnya di{" "}
                  <a
                    href={artikel[0]?.linkEdukasi}
                    target="_blank"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {artikel[0]?.sumberReferensi}
                  </a>
                </p>
              </div>
            </div>
            <div className="w-full md:w-10/12 flex justify-center items-center">
              {video[0]?.sumber === "Youtube" ? (
                <iframe
                  title="YouTube Shorts And Facebook Short"
                  src={`https://www.youtube.com/embed/${video[0]?.linkVideo}`}
                  width={300}
                  height={400}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-xl w-full"
                />
              ) : video[0]?.sumber === "Instagram" ? (
                <div className="h-[500px] overflow-hidden bg-white">
                  <blockquote
                    className="instagram-media m-auto"
                    data-instgrm-permalink={video[0]?.linkVideo}
                    data-instgrm-version="14"
                  ></blockquote>
                  <script
                    async
                    src="https://www.instagram.com/embed.js"
                  ></script>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </MainContentLayout>
  );
}
