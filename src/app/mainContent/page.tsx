"use client";

import Visualization from "@/components/visualisasi/layout";
import { getDataProduct } from "@/getDataFromApi/getProduct";
import NavigasiBar from "@/components/navbar/navigasiBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Educations from "@/components/educationComp/educations";
import { useHandleInput } from "../hooks/handle-input";

export default function MainContent() {
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [fillBottle, setFillBottle] = useState([]);
  const [miliLiter, setMiliLiter] = useState(0);
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const path = usePathname();
  const [servingSize, setServingSize] = useState(false);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });

  useEffect(() => {
    setMustFilled((prev: any) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  useEffect(() => {
    const maxSugars = localStorage.getItem("maxSugars");
    if (maxSugars) {
      setGetYourMaxSugars(Number(maxSugars));
    }
  }, []);

  function calculateMaximal() {
    setEducations(true);
    const sugarContentInsideProduct = parseFloat(
      sugarContentInsideProductRef.current?.value || "0"
    );
    const totalVolumeInsideProduct = parseFloat(
      totalVolumeInsideProductRef.current?.value || "0"
    );
    setSugarProduk(sugarContentInsideProduct);
    setVolumeProduk(totalVolumeInsideProduct);

    const resultTotalContentProduct =
      sugarContentInsideProduct / totalVolumeInsideProduct;

    const maxConsumptionMl = getYourMaxSugars / resultTotalContentProduct;
    const numberOfBottles = Math.floor(
      maxConsumptionMl / totalVolumeInsideProduct
    );

    const remainder = maxConsumptionMl % totalVolumeInsideProduct;
    const percentageFillForRemainder = Math.floor(
      (remainder / totalVolumeInsideProduct) * 100
    );

    const fillArray: any = Array(numberOfBottles).fill(100);
    if (percentageFillForRemainder > 0) {
      fillArray.push(percentageFillForRemainder);
    }
    setFillBottle(fillArray);
    setMiliLiter(percentageFillForRemainder);
  }

  function backToInput() {
    localStorage.removeItem("maxSugars");
    document.cookie =
      "formFilledSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    push("/");
  }

  useEffect(() => {
    getDataProduct((data: any) => {
      setProduct(data);
    });
  }, []);

  function handleInputChange(e: any) {
    const query = e.target.value;
    setSearchProduk(query);

    if (query !== "") {
      const filterSearchProduct = product.filter((item: any) => {
        return item.nameProduct.toLowerCase().includes(query.toLowerCase());
      });
      setResult(filterSearchProduct);
      setActiveIndex(-1);
    } else {
      setResult([]);
    }
  }

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

  function handleItemClick(item: any) {
    setSelectedProduct(item);
    setSearchProduk(item.nameProduct);
    setResult([]);
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
    if (selectedProduct) {
      setSearchProduk(selectedProduct.nameProduct);
      setSugar(selectedProduct.sugars);
      setVolume(selectedProduct.volume);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (searchProduk === "") {
      setSelectedProduct(null);
    }
  }, [searchProduk]);

  // console.log("referer", document.referrer);

  return (
    <div className="pt-24 pb-14">
      <NavigasiBar props={backToInput} path={path} />
      <div
        className={`bg-green-300 flex flex-col justify-center px-5 rounded-lg py-10 mx-auto ${
          fillBottle.length > 0
            ? `w-11/12`
            : `w-1/2 max-[640px]:w-11/12 sm:w-11/12 md:w-3/5 lg:w-1/2`
        }`}
      >
        <div className="mx-5 text-lg font-semibold max-[640px]:text-sm sm:text-sm md:text-base lg:text-base">
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
            className={`mt-10 mb-7 ${
              fillBottle.length >= 1
                ? `flex items-center justify-center gap-3 max-[640px]:flex-col max-[640px]:gap-10 sm:flex-col sm:gap-10 md:flex-row md:gap-5`
                : `flex-none`
            }`}
          >
            <form className="basis-2/5 flex flex-col gap-2 items-center justify-center md:basis-1/2 lg:basis-2/5">
              <div className="relative w-4/5 py-3 md:w-11/12 lg:w-4/5">
                <input
                  type="text"
                  className="inputField peer"
                  id="product"
                  value={searchProduk}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyEvent}
                />
                <label htmlFor="product" className="labelText">
                  Cari Produk
                </label>
                <div className={`${selectedProduct && `hidden`}`}>
                  {searchProduk !== "" && result.length > 0 && (
                    <ul
                      className="p-3 bg-green-200 absolute z-10 w-full text-blue-600 font-semibold max-h-40 overflow-y-auto rounded-b-lg"
                      ref={listRef}
                    >
                      {result.map((item: any, i: number) => (
                        <li
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`cursor-pointer hover:bg-green-300 ${
                            activeIndex === i ? "bg-green-300" : ""
                          }`}
                        >
                          {item.nameProduct}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="relative w-4/5 py-3 md:w-11/12 lg:w-4/5">
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
                    className="text-[0.65rem] text-red-600 font-semibold cursor-pointer select-none"
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
                  Kadar Gula dalam Minuman (G)
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
                  Volume Kemasan (ml)
                </label>
              </div>
            </form>

            <div className="basis-3/5 gap-8 flex justify-center items-center max-[640px]:flex-col-reverse sm:flex-col-reverse max-[640px]:w-full sm:w-full md:basis-1/2 lg:basis-3/5">
              <div className="flex w-full items-center justify-center">
                {fillBottle.map((item: any, i: number) => (
                  <div key={i} className="bottleInside w-1/5 max-[640px]:w-1/6">
                    <div className="fill" style={{ height: `${item}%` }}></div>
                  </div>
                ))}
              </div>
              <div
                className={`${
                  educations === true ? `block` : `hidden`
                } max-[640px]:text-sm text-justify mx-5 sm:text-sm font-semibold lg:text-base`}
              >
                {fillBottle.length > 1 && miliLiter > 0 ? (
                  <p>
                    Kamu Bisa Konsumsi per {fillBottle.length} botol dengan sisa{" "}
                    {miliLiter} ml
                  </p>
                ) : fillBottle.length > 1 && miliLiter <= 0 ? (
                  <p>Kamu Bisa Konsumsi per {fillBottle.length} botol</p>
                ) : (
                  <p>
                    Minuman ini Hanya Bisa Anda Konsumsi {miliLiter} ml, Kurang
                    Dari Satu Botol
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-5">
          <h1 className="text-sm mx-10 text-end max-[640px]:mx-0 max-[640px]:text-xs lg:mx-5">
            Produk yang di cari tidak ada ?{" "}
            <Link
              href={"./addProduct"}
              className="text-blue-600 hover:underline font-semibold"
            >
              klik disini
            </Link>{" "}
            untuk menambahkan produk
          </h1>
          <div className="mt-7">
            <button
              type="button"
              onClick={calculateMaximal}
              className="hover:bg-blue-400 text-lg font-semibold bg-blue-500 rounded-lg py-1 px-6 disabled:cursor-not-allowed"
              disabled={!isFormFilled()}
            >
              Hitung
            </button>
          </div>
          <Educations educations={educations} />
        </div>
        {fillBottle.length === 1 && (
          <Visualization
            sugarProduk={sugarProduk}
            volumeProduk={volumeProduk}
            getYourMaxSugars={getYourMaxSugars}
          />
        )}
      </div>
    </div>
  );
}
