"use client";

// import Visualization from "@/components/visualisasi/layout";
import { getDataProduct } from "@/getDataFromApi/getProduct";
import NavigasiBar from "@/components/navbar/navigasiBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Educations from "@/components/educationComp/educations";
import { useHandleInput } from "../../hooks/handle-input";
import { getDataFunFact } from "@/getDataFromApi/getFunFact";
import { getVideoEducations } from "@/getDataFromApi/getVideoEdu";
import FindProductError from "@/components/modalBox/layoutHorizontal/modalErrHor/findProdErr";
import { getDataArtikel } from "@/getDataFromApi/getArtikel";

export default function MainContent() {
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [fillBottle, setFillBottle] = useState<number[]>([]);
  const [educations, setEducations] = useState(false);
  const [sugarProduk, setSugarProduk] = useState(0);
  const [volumeProduk, setVolumeProduk] = useState(0);
  const [product, setProduct] = useState([]);
  const [getYourMaxSugars, setGetYourMaxSugars] = useState(0);
  const [searchProduk, setSearchProduk] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [result, setResult] = useState<any>([]);
  const [sugar, setSugar] = useState(0);
  const [volume, setVolume] = useState(0);
  const [type, setType] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const path = usePathname();
  const [servingSize, setServingSize] = useState(false);
  const [funFactSugar, setFunFactSugar] = useState([]);
  const [randomVideo, setRandomVideo] = useState([]);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });
  const focusInput = useRef<HTMLInputElement>(null);
  const [modalBox, setModalBox] = useState(false);
  const [remainingMl, setRemainingMl] = useState(0);
  const [artikel, setArtikel] = useState([]);
  const [typeProduct, setTypeProduct] = useState("");
  const [fillLess100, setFillLess100] = useState<number>(0);

  useEffect(() => {
    setMustFilled((prev: Object) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  useEffect(() => {
    const maxSugars = localStorage.getItem("maxSugars");
    if (maxSugars) {
      setGetYourMaxSugars(Number(maxSugars));
    }
  }, []);

  // Cari Data
  useEffect(() => {
    getDataProduct((data: any) => {
      setProduct(data);
    });
  }, []);

  useEffect(() => {
    getDataFunFact((data: any) => {
      setFunFactSugar(data.map((getFunFact: any) => getFunFact.funFact));
    });
  }, []);

  useEffect(() => {
    getVideoEducations((data: any) => {
      setRandomVideo(data.map((video: any) => video.linkVideo));
    });
  }, []);

  useEffect(() => {
    getDataArtikel((data: any) => {
      setArtikel(data);
    });
  }, []);

  function calculateMaximal() {
    if (result.length > 0) {
      setEducations(true);
      if (funFactSugar.length > 0 && randomVideo.length > 0) {
        setFunFactSugar((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setRandomVideo((prev) => [...prev.sort(() => Math.random() - 0.5)]);
        setArtikel((prev) => [...prev.sort(() => Math.random() - 0.5)]);
      }
      const sugarContentInsideProduct = parseFloat(
        sugarContentInsideProductRef.current?.value || "0"
      );
      const totalVolumeInsideProduct = parseFloat(
        totalVolumeInsideProductRef.current?.value || "0"
      );
      setSugarProduk(sugarContentInsideProduct);
      setVolumeProduk(totalVolumeInsideProduct);

      const resultTotalContentProduct =
        sugarContentInsideProduct / totalVolumeInsideProduct; //ubah total gula menjadi per 1 ml

      const maxConsumptionMl = getYourMaxSugars / resultTotalContentProduct;

      const numberOfBottles = Math.round(
        maxConsumptionMl / totalVolumeInsideProduct
      );

      let displayBottle = Math.round(numberOfBottles / 2);
      if (displayBottle < 1) {
        displayBottle = 1;
      }

      const sugarPerBotol =
        resultTotalContentProduct * totalVolumeInsideProduct;
      const totalSugarConsume = sugarPerBotol * displayBottle;
      const remainingSugar = getYourMaxSugars - totalSugarConsume;

      if (numberOfBottles >= 1) {
        console.log(
          `Jika kamu mengkonsumsi hanya ${displayBottle} botol maka sisa dari gula harian kamu adalah ${Math.round(
            remainingSugar
          )} gram`
        );
      }

      const remaining = maxConsumptionMl % totalVolumeInsideProduct;
      const percentageFillForRemaining = Math.round(
        (remaining / totalVolumeInsideProduct) * 100
      );

      const fillArray: number[] = Array(numberOfBottles).fill(100);
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

  function handleInputChange(e: any) {
    const query = e.target.value;
    setSearchProduk(query);

    if (query !== "") {
      const filterSearchProduct = product.filter((item: any) => {
        return item.nameProduct?.toLowerCase().startsWith(query.toLowerCase());
      });
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
    function handleKeyEvent(e: any) {
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

  function handleItemClick(item: any) {
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
          Minuman ini Maksimal Bisa Dikonsumsi {remainingMl} ml, Kurang Dari
          Satu {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
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
        className={`flex justify-center items-center mt-14 ${
          fillBottle.length > 0 ? `h-full` : `h-screen`
        }`}
      >
        <div
          className={`flex flex-col justify-center px-5 rounded-xl py-10 mx-auto bg-[#73EC8B] inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10 shadow-lg shadow-slate-800 ${
            fillBottle.length > 0
              ? `w-11/12 my-5`
              : `w-1/2 max-[640px]:w-11/12 sm:w-11/12 md:w-3/5 lg:w-1/2`
          }`}
        >
          <div className="mx-5 font-semibold max-[640px]:text-sm sm:text-base md:text-lg">
            <p>
              Maksimal Konsumsi Gula Perhari :{" "}
              <span>
                {getYourMaxSugars.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}{" "}
                Grams
              </span>
            </p>
          </div>
          <div>
            <div
              className={`my-8 ${
                fillBottle.length >= 1
                  ? `flex items-center justify-center gap-3 max-[640px]:flex-col max-[640px]:gap-10 sm:flex-col sm:gap-10 md:flex-row md:gap-5`
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
                        {result.map((item: any, i: number) => (
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
                    ref={sugarContentInsideProductRef}
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
                      <div className="text-[0.65rem] font-medium text-justify">
                        Jadi maksudnya itu adalah jika ada sebuah minuman yang
                        takaran sajinya itu 3 per kemasan dan kandungan gulanya
                        10g maka 3 X 10 yaitu total gulanya menjadi 30g gula
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
                    id="volumeKemasan"
                    className="inputField disabled:cursor-not-allowed"
                    ref={totalVolumeInsideProductRef}
                    readOnly
                    disabled
                    value={volume || ""}
                  />
                  <label htmlFor="volumeKemasan" className="labelText">
                    Volume Kemasan
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
              </form>

              <div className="basis-3/5 gap-8 flex justify-center items-center max-[640px]:flex-col-reverse sm:flex-col-reverse max-[640px]:w-full sm:w-full md:basis-1/2 lg:basis-3/5">
                <div className="flex w-full items-center justify-center max-[640px]:flex-wrap max-[640px]:gap-y-5 sm:flex-wrap sm:gap-y-5 md:flex-nowrap">
                  {/* {fillBottle.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bottleInside max-[640px]:w-1/3 sm:w-1/4"
                    >
                      <div
                        className="fill"
                        style={{ height: `${item}%` }}
                      ></div>
                    </div>
                  ))}

                  <div className="glassCupInside max-[640px]:w-1/3 sm:w-1/4">
                    <div className="fill"></div>
                  </div> */}

                  {fillBottle.map((item: any, i: number) =>
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
                        className="glassCupInside max-[640px]:w-1/3 sm:w-1/4"
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
                    educations === true ? `block` : `hidden`
                  } max-[640px]:text-sm text-justify mx-5 sm:text-base font-semibold lg:text-lg`}
                >
                  {/* {fillBottle.length > 1 ||
                  (fillBottle.length > 1 && remainingMl < 0) ? (
                    <p>
                      Kamu Bisa Konsumsi Maksimal {fillBottle.length}{" "}
                      {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}{" "}
                      {remainingMl} ml
                    </p>
                  ) : (fillBottle.length === 1 &&
                      fillLess100 < 100 &&
                      fillLess100 !== 0) ||
                    (fillBottle.length === 1 &&
                      fillLess100 < 100 &&
                      remainingMl < 0 &&
                      fillLess100 !== 0) ? (
                    <p>
                      Minuman ini Maksimal Bisa Dikonsumsi {remainingMl} ml,
                      Kurang Dari Satu{" "}
                      {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
                    </p>
                  ) : (
                    <p>
                      Kamu Bisa Konsumsi Maksimal {fillBottle.length}{" "}
                      {typeProduct === "Siap Minum" ? "Botol" : "Gelas"}
                    </p>
                  )} */}

                  {getConsumtionMessage()}
                </div>
              </div>
            </div>
            <div className="text-end mb-5">
              <h1 className="text-sm font-bold">
                jika kamu mengkonsumsi hanya 1 botol maka sisa dari gula harian
                kamu adalah .... gram
              </h1>
            </div>
          </div>

          {modalBox && <FindProductError setModalBoxErr={setModalBox} />}

          <div className="mx-5">
            <h1 className="text-sm mx-10 text-end max-[640px]:mx-0 max-[640px]:text-xs lg:mx-5">
              Produk yang di cari tidak ada ?{" "}
              <Link
                href={"/mainContent/addProduct"}
                className="text-blue-600 hover:underline font-semibold"
              >
                klik disini
              </Link>{" "}
              untuk menambahkan produk
            </h1>
            <div className="mt-7">
              <button
                type="button"
                onClick={() => calculateMaximal()}
                className="hover:bg-blue-400 text-lg font-semibold bg-blue-500 rounded-lg py-1 px-7 disabled:cursor-not-allowed"
                disabled={!isFormFilled()}
              >
                Hitung
              </button>
            </div>
          </div>

          {educations === true && (
            <Educations
              funFactSugar={funFactSugar}
              randomVideo={randomVideo}
              artikel={artikel}
            />
          )}

          {/* {fillBottle.length === 1 && (
            <Visualization
              sugarProduk={sugarProduk}
              volumeProduk={volumeProduk}
              getYourMaxSugars={getYourMaxSugars}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
