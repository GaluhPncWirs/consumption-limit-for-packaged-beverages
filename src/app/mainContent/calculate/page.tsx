"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHandleInput } from "../../hooks/handle-input";
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
import ComponentInput from "@/layout/input/content";

export default function MainContent() {
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
  const listNameProduct = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [servingSize, setServingSize] = useState<boolean>(false);
  const [funFactSugar, setFunFactSugar] = useState<string[]>([]);
  const [video, setVideo] = useState<educationsForVideo[]>([]);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });
  const focusInput = useRef<HTMLInputElement>(null);
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
    setMustFilled((prev: Object) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  useEffect(() => {
    const maxSugars = localStorage.getItem("maxSugarUser");
    if (maxSugars) {
      setMaksimalGulaHarianPengguna(Number(maxSugars));
    }
  }, []);

  function handleCalculateProductBeverage(event: any) {
    event.preventDefault();

    if (result.length > 0) {
      if (funFactSugar.length > 0 && video.length > 0) {
        setFunFactSugar((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setVideo((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setArtikel((prev) => [...prev.sort(() => Math.random() - 0.5)]);
      }
      setAppearContent(true);
      const kandunganGulaDidalamProduk = parseFloat(
        event.target.sugarContent.value
      );
      const totalIsiMinuman = parseFloat(event.target.isiBeratBersih.value);
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
        })
      );

      // menghitung sisa konsumsi
      const remaining = maxKonsumsiPerMl % totalIsiMinuman;
      // sisa tersebut dikonversi ke dalam persen
      const percentageFillForRemaining = Math.round(
        (remaining / totalIsiMinuman) * 100
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
        console.log(dataProduct);
        setProduct(dataProduct);
      }
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
              (getFunFact: educationsForFunfactSugar) => getFunFact.funFact
            )
          );
        }
      );

      const unsubscribeDataArtikel = subscribeToReleatedArtikel(
        (dataArtikel) => {
          setArtikel(dataArtikel);
        }
      );

      const unsubscribeDataVideoEducation = subscribeToVideoEducation(
        (dataVideo) => {
          setVideo(dataVideo);
        }
      );

      return () => {
        unsubscribeDataFunFactSugar(),
          unsubscribeDataArtikel(),
          unsubscribeDataVideoEducation();
      };
    }
  }, [appearContent]);

  useEffect(() => {
    if (!type) {
      setTypeProduct(type);
    }
  }, [type]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchProduk(query);

    if (query !== "") {
      const filterSearchProduct = product.filter(
        (item: productBeverageTypes) => {
          return item.nameProduct
            ?.toLowerCase()
            .startsWith(query.toLowerCase());
        }
      );
      setResult(filterSearchProduct);
      setActiveIndex(-1);
    } else {
      setResult([]);
    }
  }

  function scrollToActiveItem(index: number) {
    const listProduct = listNameProduct.current;
    if (listProduct) {
      const activeItemProd = listProduct.children[index] as HTMLElement;
      if (activeItemProd) {
        activeItemProd.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }

  useEffect(() => {
    function handleKeyEvent(e: KeyboardEvent) {
      if (result.length > 0) {
        if (e.key === "ArrowDown") {
          setActiveIndex((prev) => {
            const newIndex = (prev + 1) % result.length;
            scrollToActiveItem(newIndex);
            return newIndex;
          });
        } else if (e.key === "ArrowUp") {
          setActiveIndex((prev) => {
            const newIndex = (prev - 1 + result.length) % result.length;
            scrollToActiveItem(newIndex);
            return newIndex;
          });
        } else if (e.key === "Enter" && activeIndex >= 0) {
          setSelectedProduct(result[activeIndex]);
          setIsOpenSearchProduct(false);
        } else {
          setIsOpenSearchProduct(true);
        }
      }
    }

    document.addEventListener("keydown", handleKeyEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, [result, activeIndex]);

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
          <span>
            {maksimalGulaHarianPengguna.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}{" "}
            Gram
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center p-7 rounded-lg bg-[#f9fff9] mt-20 mb-12 shadow-lg shadow-slate-700 md:p-9">
        <h1 className="text-2xl font-semibold tracking-wide">
          Hitung Konsumsi Minuman
        </h1>
        <div
          className={`mt-7 ${
            fillBottle.length >= 1
              ? `flex items-center justify-center flex-col gap-y-7 lg:flex-row lg:gap-x-3`
              : `flex-col`
          }`}
        >
          <form
            className="basis-2/5"
            autoComplete="off"
            onSubmit={(e) => handleCalculateProductBeverage(e)}
          >
            <div className="flex flex-col gap-y-5 items-center justify-center">
              <ComponentInput
                titleInput="Cari Produk"
                srcImg="/images/global/search.png"
                altImg="Cari"
                htmlFor="product"
              >
                <Command>
                  <input
                    type="text"
                    className="inputField peer"
                    id="product"
                    value={searchProduk}
                    onChange={handleInputChange}
                    required
                    ref={focusInput}
                  />
                  {isOpenSearchProduct && (
                    <div>
                      {searchProduk !== "" && result.length > 0 && (
                        <CommandList
                          className="p-3 bg-slate-200 absolute z-10 w-full text-[#333333] font-medium max-h-40 overflow-y-auto rounded-b-lg"
                          ref={listNameProduct}
                        >
                          <CommandEmpty>Produk Tidak Ditemukan.</CommandEmpty>
                          <CommandGroup heading="Pilih Produk">
                            {result.map(
                              (item: productBeverageTypes, i: number) => (
                                <CommandItem
                                  key={item.id}
                                  onSelect={() => handleItemClick(item)}
                                  className={`cursor-pointer mb-1 ${
                                    activeIndex === i ? "bg-slate-100" : ""
                                  }`}
                                >
                                  {item.nameProduct}
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </CommandList>
                      )}
                    </div>
                  )}
                </Command>
              </ComponentInput>

              <ComponentInput
                titleInput="Kadar Gula (G)"
                srcImg="/images/pageAddProduct/sugar.png"
                altImg="sugar"
                htmlFor="sugarContent"
              >
                <input
                  type="number"
                  id="sugarContent"
                  className="inputField"
                  readOnly
                  disabled
                  value={sugar || ""}
                />
                <div className="text-xs mt-1.5">
                  <h1
                    className="tracking-wide text-[#F93827] font-semibold cursor-pointer mb-1"
                    onClick={() => setServingSize((prev) => !prev)}
                  >
                    * Gula Disini Sudah di Totalkan Dengan Takaran Saji Per
                    Kemasan
                  </h1>
                  {servingSize && (
                    <p className="text-justify ">
                      Jika minuman yang takaran sajinya itu 3 per kemasan dan
                      kandungan gulanya 10g maka 3 X 10 yaitu total gulanya
                      menjadi 30g gula
                    </p>
                  )}
                </div>
              </ComponentInput>

              <ComponentInput
                titleInput="Isi Bersih (ml)"
                srcImg="/images/pageAddProduct/ml.png"
                altImg="isi Bersih"
                htmlFor="isiBeratBersih"
              >
                <input
                  type="number"
                  id="isiBeratBersih"
                  className="inputField"
                  readOnly
                  disabled
                  value={volume || ""}
                />
              </ComponentInput>

              <ComponentInput
                titleInput="Tipe Minuman"
                srcImg="/images/pageAddProduct/typeBeverage.png"
                altImg="Tipe"
                htmlFor="type"
              >
                <input
                  id="type"
                  className="inputField"
                  readOnly
                  disabled
                  value={type || ""}
                />
              </ComponentInput>

              <h1 className="text-sm w-full">
                Produk yang di cari tidak ada?{" "}
                <Link
                  href={"/mainContent/addProduct"}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  klik disini
                </Link>{" "}
                untuk menambahkan produk
              </h1>
            </div>

            <button
              type="submit"
              className="disabled:cursor-not-allowed py-1.5 text-center rounded-md bg-green-400 hover:bg-green-500 cursor-pointer font-semibold tracking-wider px-7 text-lg mx-2 w-32 mt-7"
              disabled={!isFormFilled()}
            >
              Hitung
            </button>
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
                )
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
