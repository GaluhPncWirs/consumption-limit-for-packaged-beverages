"use client";

import Visualization from "@/components/visualisasi/page";
import { getDataFunFact } from "@/getDataFromApi/getFunFact";
import { getDataProduct } from "@/getDataFromApi/getProduct";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function MainContent() {
  const sugarContentInsideProductRef = useRef<HTMLInputElement>(null);
  const totalVolumeInsideProductRef = useRef<HTMLInputElement>(null);
  const { push } = useRouter();
  const [fillBottle, setFillBottle] = useState([]);
  const [miliLiter, setMiliLiter] = useState(0);
  const [text, setText] = useState(false);
  const [sugarProduk, setSugarProduk] = useState(0);
  const [volumeProduk, setVolumeProduk] = useState(0);
  const [funFactSugar, setFunFactSugar] = useState([]);
  const [product, setProduct] = useState([]);
  const [getYourMaxSugars, setGetYourMaxSugars] = useState(0);
  const [searchProduk, setSearchProduk] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [result, setResult] = useState<any>([]);
  const [sugar, setSugar] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const maxSugars = localStorage.getItem("maxSugars");
    if (maxSugars) {
      setGetYourMaxSugars(Number(maxSugars));
    }
  }, []);

  function calculateMaximal() {
    setText(true);
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
    push("/");
  }

  useEffect(() => {
    getDataFunFact((data: any) => {
      const randomFunFact = data
        .map((a: any) => a.funFact)
        .sort(() => Math.random() - 0.5);

      setFunFactSugar(randomFunFact);
    });
  }, []);

  useEffect(() => {
    getDataProduct((data: any) => {
      setProduct(data);
    });
  }, []);

  useEffect(() => {
    if (product.length > 0) {
      const filterSearchProduct = product.filter((item: any) => {
        return item.nameProduct
          .toLowerCase()
          .includes(searchProduk.toLowerCase());
      });
      setResult(filterSearchProduct);
    }
  }, [product, searchProduk]);

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

  return (
    <div>
      <div
        className={`bg-red-300 flex justify-center items-center ${
          fillBottle.length === 1 ? `h-full` : `h-screen`
        }`}
      >
        <div
          className={`py-10 ${fillBottle.length >= 1 ? `w-11/12` : `w-1/2`}`}
        >
          <div className="w-full mx-auto bg-green-300 h-full flex flex-col justify-center px-5 rounded-lg py-8">
            <div className="mx-5 text-lg font-semibold flex justify-between">
              <p>
                Your Max Consume Sugar Per Day :{" "}
                <span>
                  {getYourMaxSugars.toLocaleString("id-ID", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  Grams
                </span>
              </p>
              <div className={`${text === true ? `block` : `hidden`}`}>
                {fillBottle.length > 1 && miliLiter > 0 ? (
                  <p>
                    Konsumsi per {fillBottle.length} botol dengan sisa{" "}
                    {miliLiter} ml
                  </p>
                ) : fillBottle.length > 1 && miliLiter <= 0 ? (
                  <p>Konsumsi per {fillBottle.length} botol</p>
                ) : (
                  <p>
                    Minuman ini bisa anda konsumsi {miliLiter} ml, kurang dari
                    satu botol
                  </p>
                )}
              </div>
            </div>
            <div>
              <div
                className={`my-10 ${
                  fillBottle.length >= 1
                    ? `flex items-center justify-center gap-3`
                    : `flex-none`
                }`}
              >
                <form className="basis-2/5 flex flex-col gap-2 items-center justify-center">
                  <div className="relative w-4/5 py-3">
                    <input
                      type="text"
                      className="inputField peer"
                      value={searchProduk}
                      id="product"
                      onChange={(e) => setSearchProduk(e.target.value)}
                    />
                    <label htmlFor="product" className="labelText">
                      Cari Produk
                    </label>
                    <div className={`${selectedProduct && `hidden`}`}>
                      {searchProduk !== "" && (
                        <ul className="p-3 bg-red-200 absolute z-10 w-full text-blue-600 font-semibold max-h-40 overflow-y-auto rounded-b-lg">
                          {result.map((item: any) => (
                            <li
                              key={item.id}
                              onClick={() => setSelectedProduct(item)}
                              className="cursor-pointer hover:bg-slate-400"
                            >
                              {item.nameProduct}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="relative w-4/5 py-3">
                    <input
                      type="number"
                      id="sugarContent"
                      className="inputField"
                      ref={sugarContentInsideProductRef}
                      readOnly
                      disabled
                      value={sugar || ""}
                    />
                    <label htmlFor="sugarContent" className="labelText">
                      Kadar Gula dalam Minuman (Grams) :
                    </label>
                  </div>
                  <div className="relative w-4/5 py-3">
                    <input
                      type="number"
                      id="volumeKemasan"
                      className="inputField"
                      ref={totalVolumeInsideProductRef}
                      readOnly
                      disabled
                      value={volume || ""}
                    />
                    <label htmlFor="volumeKemasan" className="labelText">
                      Volume Kemasan (ml) :
                    </label>
                  </div>
                </form>
                {fillBottle.length > 0 && (
                  <div className="basis-3/5 mb-5 flex justify-center items-center">
                    {fillBottle.map((item: any, i: number) => (
                      <div key={i} className="bottleInside w-1/5">
                        <div
                          className="fill"
                          style={{ height: `${item}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="my-5 mx-10 flex justify-between">
              <button
                type="button"
                onClick={calculateMaximal}
                className="hover:bg-blue-400 text-lg font-semibold bg-blue-500 rounded-lg py-1 px-7"
              >
                Hitung
              </button>
              <button
                type="button"
                onClick={backToInput}
                className="hover:bg-blue-400 text-lg font-semibold bg-blue-500 rounded-lg py-1 px-7"
              >
                Kembali
              </button>
            </div>
            <div>
              {text === true && (
                <div className="mt-5">
                  <h1 className="font-semibold text-lg">
                    Fun Fact Tentang Gula
                  </h1>
                  <div className="font-medium text-sm">{funFactSugar[0]}</div>
                </div>
              )}
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
      </div>
    </div>
  );
}
