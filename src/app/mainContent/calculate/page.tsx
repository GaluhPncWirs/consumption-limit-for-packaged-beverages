"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Educations from "@/components/educationComp/educations";
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
import IconWarning from "@/components/warningIcon/icon";
import MainContentLayout from "@/layout/mainContent";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [servingSize, setServingSize] = useState<boolean>(false);
  const [funFactSugar, setFunFactSugar] = useState<string[]>([]);
  const [video, setVideo] = useState<educationsForVideo[]>([]);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });
  const focusInput = useRef<HTMLInputElement>(null);
  const [modalBox, setModalBox] = useState<boolean>(false);
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
      setModalBox(true);
    }
  }

  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToProducts(
      (dataProduct) => {
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

  useEffect(() => {
    if (focusInput.current) {
      focusInput.current.value = "";
    }
  }, [modalBox]);

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

  useEffect(() => {
    function handleKeyEvent(e: KeyboardEvent) {
      if (result.length > 0) {
        if (e.key === "ArrowDown") {
          setActiveIndex((prev) => {
            const newIndex = (prev + 1) % result.length;
            return newIndex;
          });
        } else if (e.key === "ArrowUp") {
          setActiveIndex((prev) => {
            const newIndex = (prev - 1 + result.length) % result.length;
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
      fillLess100 !== 0 //(fillBottle.length === 1 && fillLess100 < 100 && remainingMl < 0 && fillLess100 !== 0)
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
        <h1 className="font-semibold text-lg tracking-wide px-2">
          Maksimal Konsumsi Gula Perhari{" "}
          <span>
            {maksimalGulaHarianPengguna.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}{" "}
            Gram
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center p-5 rounded-lg bg-[#f9fff9] mt-20 mb-12 shadow-lg shadow-slate-700">
        <h1 className="text-2xl font-semibold tracking-wide mx-2">
          Hitung Konsumsi Minuman
        </h1>
        <div
          className={`mt-8 ${
            fillBottle.length >= 1
              ? `flex items-center justify-center flex-col max-[640px]:gap-y-7 sm:gap-10 md:flex-row md:gap-x-3`
              : `flex-col`
          }`}
        >
          <form
            className="basis-2/5"
            autoComplete="off"
            onSubmit={(e) => handleCalculateProductBeverage(e)}
          >
            <div className="flex flex-col gap-y-5 items-center justify-center">
              <div className="relative pt-4 w-11/12">
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
                  <label htmlFor="product" className="labelText tracking-wide">
                    Cari Produk
                  </label>
                  {isOpenSearchProduct && (
                    <div>
                      {searchProduk !== "" && result.length > 0 && (
                        <CommandList className="p-3 bg-slate-200 absolute z-10 w-full text-[#333333] font-medium max-h-40 overflow-y-auto rounded-b-lg">
                          <CommandEmpty>Produk Tidak Ditemukan.</CommandEmpty>
                          <CommandGroup heading="Pilih Produk">
                            {result.map(
                              (item: productBeverageTypes, i: number) => (
                                <CommandItem
                                  key={item.id}
                                  onSelect={() => handleItemClick(item)}
                                  className="cursor-pointer mb-1"
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
              </div>

              <div className="relative pt-4 w-11/12">
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
                <label
                  htmlFor="sugarContent"
                  className="labelText tracking-wide"
                >
                  Kadar Gula Minuman (G)
                </label>
              </div>

              <div className="relative pt-4 w-11/12">
                <input
                  type="number"
                  id="isiBeratBersih"
                  className="inputField"
                  readOnly
                  disabled
                  value={volume || ""}
                />
                <label
                  htmlFor="isiBeratBersih"
                  className="labelText tracking-wide"
                >
                  Isi Bersih (ml)
                </label>
              </div>

              <div className="relative pt-4 w-11/12">
                <input
                  id="type"
                  className="inputField"
                  readOnly
                  disabled
                  value={type || ""}
                />
                <label htmlFor="type" className="labelText tracking-wide">
                  Tipe Minuman
                </label>
              </div>

              <h1 className="text-sm w-11/12">
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
              className="disabled:cursor-not-allowed py-1.5 text-center rounded-md bg-[#54C392] hover:bg-green-500 cursor-pointer font-semibold tracking-wider px-7 text-lg mx-2 w-32 mt-7"
              disabled={!isFormFilled()}
            >
              Hitung
            </button>
          </form>

          <div className="gap-6 flex justify-center items-center flex-col md:basis-1/2 lg:basis-3/4">
            <div
              className={`${
                appearContent === true ? `block` : `hidden`
              } font-semibold text-lg tracking-wide mx-3`}
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
              <h1 className="text-sm tracking-wide font-semibold text-justify max-w-sm">
                {`Jika Kamu Mengkonsumsi Hanya ${messageIfDrinkSomeBottles.botol} Botol Maka Sisa Dari Gula
                  Harian Kamu Adalah ${messageIfDrinkSomeBottles.sisaGula} Gram`}
              </h1>
            )}
          </div>
        </div>

        {appearContent === true && (
          <Educations
            funFactSugar={funFactSugar}
            video={video}
            artikel={artikel}
          />
        )}
      </div>
      {modalBox && (
        <div className="h-full absolute inset-0 bg-black/50 sm:mt-16 max-[640px]:mt-16">
          <div className="bg-[#4ADE80] w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/3 z-40 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 shadow-lg shadow-slate-700">
            <div className="flex justify-center items-center h-3/4 gap-x-8 max-[640px]:gap-x-5 max-[640px]:px-6 sm:px-6 md:px-8 lg:px-10">
              <IconWarning />
              <div className="w-full">
                <h1 className="font-bold text-xl">Input Harus Sesuai</h1>
                <p className="font-medium mt-3">
                  Tolong Untuk Cari Yang Telah Disediakan
                </p>
              </div>
            </div>
            <div className="h-1/4 bg-[#22C55E] rounded-b-xl flex justify-center items-center hover:bg-green-600">
              <button
                className="text-xl font-semibold w-full h-full max-[640px]:text-lg"
                onClick={() => setModalBox(false)}
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </MainContentLayout>
  );
}
