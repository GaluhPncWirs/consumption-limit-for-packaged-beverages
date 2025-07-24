"use client";

import NavigasiBar from "@/components/navbar/navigasiBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export default function MainContent() {
  const sugarInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
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
  const listRef = useRef<HTMLUListElement | null>(null);
  const path = usePathname();
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

  useEffect(() => {
    setMustFilled((prev: Object) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  useEffect(() => {
    const maxSugars = localStorage.getItem("maxSugars");
    if (maxSugars) {
      setMaksimalGulaHarianPengguna(Number(maxSugars));
    }
  }, []);

  function calculateMaximal() {
    if (result.length > 0) {
      if (funFactSugar.length > 0 && video.length > 0) {
        setFunFactSugar((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setVideo((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setArtikel((prev) => [...prev.sort(() => Math.random() - 0.5)]);
      }
      setAppearContent(true);
      const kandunganGulaDidalamProduk = parseFloat(
        sugarInsideProductRef.current?.value || "0"
      );
      const totalIsiMinuman = parseFloat(
        totalVolumeInsideProductRef.current?.value || "0"
      );
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

  // // ambil data funfact tentang gula
  // useEffect(() => {
  //   const unsubscribeDataFunFactSugar = subscribeToFunFactSugars(
  //     (dataFunfact) => {
  //       setFunFactSugar(
  //         dataFunfact.map(
  //           (getFunFact: educationsForFunfactSugar) => getFunFact.funFact
  //         )
  //       );
  //     }
  //   );

  //   return () => unsubscribeDataFunFactSugar();
  // }, []);

  // // useEffect(() => {
  // //   getDataFunFact((dataFunfact: educationsForFunfactSugar[]) => {
  // //     setFunFactSugar(
  // //       dataFunfact.map(
  // //         (getFunFact: educationsForFunfactSugar) => getFunFact.funFact
  // //       )
  // //     );
  // //   });
  // // }, []);

  // // ambil data artikel
  // useEffect(() => {
  //   const unsubscribeDataArtikel = subscribeToReleatedArtikel((dataArtikel) => {
  //     setArtikel(dataArtikel)
  //   })

  //   return () => unsubscribeDataArtikel()
  // },[])

  // // useEffect(() => {
  // //   getDataArtikel((dataArtikel: educationsForArtikel[]) => {
  // //     setArtikel(dataArtikel);
  // //   });
  // // }, []);

  // // ambil data video edukasi
  // useEffect(() => {
  //   const unsubscribeDataVideoEducation = subscribeToVideoEducation((dataVideo) => {
  //     setVideo(dataVideo)
  //   })

  //   return () => unsubscribeDataVideoEducation()
  // },[])

  // // useEffect(() => {
  // //   getVideoEducations((dataVideo: educationsForVideo[]) => {
  // //     setVideo(dataVideo);
  // //   });
  // // }, []);

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

  function backToInput() {
    localStorage.removeItem("maxSugars");
    document.cookie =
      "formFilledSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    push("/");
  }

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

  function scrollToActiveItem(i: number) {
    const list = listRef.current;
    if (list) {
      const activeItem = list.children[i] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({
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
          Kamu Bisa Konsumsi Maksimal {fillBottle.length}{" "}
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
          Minuman ini Maksimal Bisa Dikonsumsi {remainingMl} ml, hanya 1{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </p>
      );
    } else {
      return (
        <p>
          Kamu Bisa Konsumsi Maksimal {fillBottle.length}{" "}
          {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
        </p>
      );
    }
  }

  return (
    <div>
      <NavigasiBar path={path} props={backToInput} />
      <div
        className={`flex justify-center items-center mt-16 ${
          fillBottle.length > 0 ? `h-full` : `h-screen`
        }`}
      >
        <div
          className={`flex flex-col justify-center px-5 rounded-xl py-10 mx-auto bg-[#73EC8B] max-[640px]:px-2 max-[640px]:py-7 ${
            fillBottle.length > 0
              ? `w-11/12 my-5`
              : `max-[640px]:w-11/12 sm:w-11/12 md:w-3/5 lg:w-1/2`
          }`}
        >
          <p className="mx-5 font-semibold max-[640px]:text-base sm:text-lg">
            Maksimal Konsumsi Gula Perhari :{" "}
            <span>
              {maksimalGulaHarianPengguna.toLocaleString("id-ID", {
                maximumFractionDigits: 0,
              })}{" "}
              Gram
            </span>
          </p>
          <div>
            <div
              className={`my-5 ${
                fillBottle.length >= 1
                  ? `flex items-center justify-center max-[640px]:flex-col max-[640px]:gap-y-7 sm:flex-col sm:gap-10 md:flex-row md:gap-x-3 md:mx-3 lg:mx-0`
                  : `flex-none`
              }`}
            >
              <form
                className="basis-2/5 flex flex-col gap-2 items-center justify-center md:basis-1/2 lg:basis-2/5 max-[640px]:w-full sm:w-full"
                autoComplete="off"
              >
                <div className="relative w-4/5 py-3 md:w-11/12 lg:w-4/5">
                  <input
                    type="text"
                    className="inputField peer"
                    id="product"
                    value={searchProduk}
                    onChange={handleInputChange}
                    required
                    ref={focusInput}
                  />
                  <label htmlFor="product" className="labelText">
                    Cari Produk
                  </label>
                  <div className={`${selectedProduct && `hidden`}`}>
                    {searchProduk !== "" && result.length > 0 && (
                      <ul
                        className="p-3 bg-green-300 absolute z-10 w-full text-[#333333] font-medium max-h-40 overflow-y-auto rounded-b-lg"
                        ref={listRef}
                      >
                        {result.map((item: productBeverageTypes, i: number) => (
                          <li
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`cursor-pointer hover:bg-green-400 mb-1 ${
                              activeIndex === i ? "bg-green-400" : ""
                            }`}
                          >
                            {item.nameProduct}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="relative w-4/5 pt-3 md:w-11/12 lg:w-4/5">
                  <input
                    type="number"
                    id="sugarContent"
                    className="inputField disabled:cursor-not-allowed"
                    ref={sugarInsideProductRef}
                    readOnly
                    disabled
                    value={sugar || ""}
                  />
                  <div>
                    <span
                      className="text-[0.65rem] text-[#F93827] font-semibold cursor-pointer select-none"
                      onClick={() => setServingSize((prev) => !prev)}
                    >
                      *Gula Disini Sudah di Totalkan Dengan Takaran Saji Per
                      Kemasan
                    </span>
                    {servingSize && (
                      <div className="text-xs font-medium text-justify">
                        Jadi maksudnya adalah jika minuman yang takaran sajinya
                        itu 3 per kemasan dan kandungan gulanya 10g maka 3 X 10
                        yaitu total gulanya menjadi 30g gula
                      </div>
                    )}
                  </div>
                  <label htmlFor="sugarContent" className="labelText">
                    Kadar Gula Minuman (G)
                  </label>
                </div>

                <div className="relative w-4/5 py-3 md:w-11/12 lg:w-4/5">
                  <input
                    type="number"
                    id="isiBeratBersih"
                    className="inputField disabled:cursor-not-allowed"
                    ref={totalVolumeInsideProductRef}
                    readOnly
                    disabled
                    value={volume || ""}
                  />
                  <label htmlFor="isiBeratBersih" className="labelText">
                    isi Bersih (ml)
                  </label>
                </div>
                <div className="relative w-4/5 pt-3 md:w-11/12 lg:w-4/5">
                  <input
                    id="type"
                    className="inputField disabled:cursor-not-allowed"
                    readOnly
                    disabled
                    value={type || ""}
                  />
                  <label htmlFor="type" className="labelText">
                    Tipe Minuman
                  </label>
                </div>
                <h1 className="text-sm mt-2 max-[640px]:mx-3 max-[640px]:text-xs lg:mx-4 text-center">
                  Produk yang di cari tidak ada ?{" "}
                  <Link
                    href={"/mainContent/addProduct"}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    klik disini
                  </Link>{" "}
                  untuk menambahkan produk
                </h1>
              </form>

              <div className="basis-3/5 gap-8 flex justify-center items-center max-[640px]:flex-col-reverse sm:flex-col-reverse max-[640px]:w-full sm:w-full md:basis-1/2 lg:basis-3/5">
                <div className="flex w-full items-center justify-center max-[640px]:flex-wrap max-[640px]:gap-y-5 sm:flex-wrap sm:gap-y-5 md:flex-nowrap">
                  {fillBottle.map((item: number, i: number) =>
                    typeProduct === "Siap Minum" ? (
                      <div
                        key={i}
                        className="bottleInside max-[640px]:w-1/3 sm:w-1/4"
                      >
                        <div
                          className="fill"
                          style={{ height: `${item}%` }}
                        ></div>
                      </div>
                    ) : (
                      <div
                        className="glassCupInside max-[640px]:w-1/5 sm:w-1/5 md:w-1/4 max-[640px]:ml-5 sm:ml-5 lg:ml-0"
                        key={i}
                      >
                        <div
                          className="fill"
                          style={{ height: `${item}%` }}
                        ></div>
                      </div>
                    )
                  )}
                </div>
                <div
                  className={`${
                    appearContent === true ? `block` : `hidden`
                  } mx-5 font-semibold max-[640px]:text-base max-[640px]:text-center sm:text-lg sm:text-center md:text-center md:text-base lg:text-lg lg:max-w-lg`}
                >
                  {getConsumtionMessage()}
                  <h2 className="sm:text-xs max-[640px]:text-xs text-[#F93827] mt-1">
                    *Disclaimer Ini hanya berlaku jika kamu belum ada asupan
                    gula sama sekali di hari ini. Kalau sudah ada, sebaiknya
                    jumlahnya dikurangi.
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-3 flex max-[640px]:flex-col-reverse max-[640px]:gap-y-5 max-[640px]:items-start max-[640px]:justify-normal sm:flex-col-reverse sm:gap-y-5 sm:items-start sm:justify-normal md:flex-row md:justify-between md:items-center">
            <button
              type="button"
              onClick={() => calculateMaximal()}
              className="hover:bg-blue-400 text-lg font-semibold bg-blue-500 rounded-lg py-1 px-7 disabled:cursor-not-allowed"
              disabled={!isFormFilled()}
            >
              Hitung
            </button>
            {totalBotol >= 1 && (
              <div className="max-[640px]:text-sm max-[640px]:text-center sm:text-base sm:text-center md:flex md:justify-end lg:mr-5">
                <h1 className="text-sm font-bold md:max-w-sm md:text-justify lg:max-w-lg">
                  {`Jika Kamu Mengkonsumsi Hanya ${messageIfDrinkSomeBottles.botol} Botol Maka Sisa Dari Gula
                  Harian Kamu Adalah ${messageIfDrinkSomeBottles.sisaGula} Gram`}
                </h1>
              </div>
            )}
          </div>
          {appearContent === true && (
            <Educations
              funFactSugar={funFactSugar}
              video={video}
              artikel={artikel}
            />
          )}
        </div>
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
    </div>
  );
}
