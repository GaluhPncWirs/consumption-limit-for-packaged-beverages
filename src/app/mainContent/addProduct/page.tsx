"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import NavigasiBar from "@/components/navbar/navigasiBar";
import { useHandleInput } from "@/app/hooks/handle-input";
import LayoutModalBoxs from "@/components/modalBox/layout";
import { useEffect, useRef, useState } from "react";
import ModalError from "@/components/modalBox/err";
import { getDataProduct } from "@/getDataFromApi/getProduct";

export default function AddProduct() {
  const path = usePathname();
  const { mustFilled, handleValueInput, isFormFilled, setMustFilled } =
    useHandleInput({
      nameProduct: "",
      kandunganGula: "",
      takaranSaji: "",
      volume: "",
    });
  const [modal, setModal] = useState(false);
  const [modalErr, setModalErr] = useState(false);
  const [status, setStatus] = useState(null);
  const inputFieldNone = useRef(null);
  const [findData, setFindData] = useState([]);
  const [searchProduk, setSearchProduk] = useState<string>("");
  const [result, setResult] = useState([]);

  // Tambah Data
  async function handleAddProduct(event: any) {
    event.preventDefault();
    if (
      !isNaN(event.target.nameProduct.value) ||
      event.target.nameProduct.value.trim() === ""
    ) {
      setModalErr(true);
    } else {
      setModal(true);

      // total gula
      const gula = event.target.kandunganGula.value;
      const takaranSaji = Number(event.target.takaranSaji.value);
      const totalSugars = gula * takaranSaji;

      // huruf kapital setiap huruf pertama
      const nameProductValue = event.target.nameProduct.value;
      const eachCapitalFirstWord = nameProductValue
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const res = await fetch("/api/addData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameProduct: eachCapitalFirstWord,
          sugars: Math.floor(totalSugars),
          volume: Number(event.target.volume.value),
        }),
      });

      const resStatus = await res.json();
      setStatus(resStatus.status);
    }
  }

  useEffect(() => {
    setMustFilled({
      nameProduct: "",
      kandunganGula: "",
      takaranSaji: "",
      volume: "",
    });
  }, [modal, setMustFilled, modalErr]);

  // Cari Data Produk
  useEffect(() => {
    getDataProduct((data: any) => {
      setFindData(data);
    });
  }, []);

  function handleInputChange(e: any) {
    const query = e.target.value;
    setSearchProduk(query);

    if (query !== "") {
      const filterSearchProduct = findData.filter((item: any) => {
        return item.nameProduct.toLowerCase().startsWith(query.toLowerCase());
      });
      setResult(filterSearchProduct);
    } else {
      setResult([]);
    }
  }

  return (
    <div>
      <NavigasiBar path={path} props={""} />
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="bg-green-300 w-2/5 rounded-xl mt-16 max-[640px]:w-11/12 sm:w-10/12 md:w-9/12 lg:w-2/3 py-3">
          <h1 className="text-xl font-semibold text-center mt-7">
            Penambahan Produk Minuman
          </h1>
          <div className="flex p-5 items-center justify-evenly">
            <form
              onSubmit={(e) => handleAddProduct(e)}
              className="flex flex-col gap-y-5 basis-1/2"
              autoComplete="off"
              ref={inputFieldNone}
            >
              <div className="relative pt-3 font-medium">
                <input
                  type="text"
                  id="nameProduct"
                  className="inputField peer"
                  onChange={handleValueInput}
                  value={mustFilled.nameProduct}
                />
                <label
                  htmlFor="nameProduct"
                  className="labelText flex items-center -ml-1.5 gap-1"
                >
                  <Image
                    src={"/images/beverage.png"}
                    alt="beverage"
                    width={27}
                    height={27}
                  />
                  <span>Nama Produk</span>
                </label>
              </div>
              <div className="relative pt-3 font-medium">
                <input
                  type="number"
                  id="kandunganGula"
                  className="inputField peer"
                  onChange={handleValueInput}
                  value={mustFilled.kandunganGula}
                />
                <label
                  htmlFor="kandunganGula"
                  className="labelText flex items-center gap-2"
                >
                  <Image
                    src={"/images/sugar.png"}
                    alt="beverage"
                    width={20}
                    height={20}
                  />
                  <span>Kandungan Gula Minuman</span>
                </label>
              </div>
              <div className="relative pt-3 font-medium">
                <input
                  type="number"
                  min={0.01}
                  max={50}
                  step="0.01"
                  id="takaranSaji"
                  className="inputField peer"
                  onChange={handleValueInput}
                  value={mustFilled.takaranSaji}
                />
                <label
                  htmlFor="takaranSaji"
                  className="labelText flex items-center gap-2"
                >
                  <Image
                    src={"/images/serving.png"}
                    alt="beverage"
                    width={20}
                    height={20}
                  />
                  <span>Takaran Saji Per Kemasan</span>
                </label>
              </div>
              <div className="relative pt-3 font-medium">
                <input
                  type="number"
                  id="volume"
                  className="inputField peer"
                  onChange={handleValueInput}
                  value={mustFilled.volume}
                />
                <label
                  htmlFor="volume"
                  className="labelText flex items-center gap-2"
                >
                  <Image
                    src={"/images/ml.png"}
                    alt="beverage"
                    width={20}
                    height={20}
                  />
                  <span>Volume Kemasan (ml)</span>
                </label>
              </div>
              <button
                className="bg-green-500 mt-5 rounded-lg hover:bg-green-600 py-1.5 flex text-lg font-semibold disabled:cursor-not-allowed justify-center items-center gap-2"
                disabled={!isFormFilled()}
              >
                <Image
                  src={"/images/add-product.png"}
                  alt="add Product"
                  width={30}
                  height={30}
                  className="bg-cover"
                />
                <span>Tambah Produk</span>
              </button>
              <span className="text-red-500 font-semibold text-sm text-center">
                *Tolong Untuk Digunakan Secara Bijak
              </span>
            </form>
            <div className="bg-[#54C392] basis-2/5 h-5/6 rounded-lg">
              <h1 className="py-3 text-center font-semibold text-lg bg-[#15B392] rounded-t-lg">
                Cek Produk Yang Tersedia
              </h1>
              <div className="flex flex-col">
                <form className="relative flex items-center">
                  <input
                    type="text"
                    className="inputField pl-10 pr-5 pb-1 mx-3"
                    value={searchProduk}
                    onChange={handleInputChange}
                    id="search"
                  />
                  <label htmlFor="search" className="absolute left-4">
                    {" "}
                    <Image
                      src={"/images/search-icon.png"}
                      alt="Search"
                      width={60}
                      height={60}
                      className="w-1/2"
                    />
                  </label>
                </form>
                <ul className="m-3 h-60 px-5 py-2 overflow-auto">
                  {result.map((item: any) => (
                    <li key={item.id}>{item.nameProduct}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {modal && (
            <LayoutModalBoxs>
              {status === true ? (
                <LayoutModalBoxs.ModalAddProductSuccess
                  setModalOnclick={setModal}
                />
              ) : status === false ? (
                <LayoutModalBoxs.ModalAddProductSame
                  setModalOnclick={setModal}
                />
              ) : (
                <LayoutModalBoxs.LoadingAnimation />
              )}
            </LayoutModalBoxs>
          )}

          {modalErr && <ModalError setModal={setModalErr} />}
        </div>
      </div>
    </div>
  );
}
