"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import NavigasiBar from "@/components/navbar/navigasiBar";
import { useHandleInput } from "@/app/hooks/handle-input";
import LayoutModalBoxs from "@/components/modalBox/layout";
import { useEffect, useRef, useState } from "react";
import AddProductError from "@/components/modalBox/layoutVertical/modalErrVer/addError";
import ConfirmAddProduct from "@/components/modalBox/layoutVertical/modalConfirm/confirm";
import { productBeverageTypes } from "@/types/dataTypes";
import { subscribeToProducts } from "@/lib/firebase/services";

export default function AddProduct() {
  const path = usePathname();
  const { mustFilled, handleValueInput, isFormFilled, setMustFilled } =
    useHandleInput({
      nameProduct: "",
      kandunganGula: "",
      takaranSaji: "",
      volume: "",
      typeMinuman: "",
    });

  const [modalErr, setModalErr] = useState<boolean>(false);
  const [isStatus, setIsStatus] = useState<boolean | null>(null);
  const inputFieldNone = useRef(null);
  const [findData, setFindData] = useState<productBeverageTypes[]>([]);
  const [searchProduk, setSearchProduk] = useState<string>("");
  const [result, setResult] = useState<productBeverageTypes[]>([]);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(false);

  const maxLengthAlphabethNameProduct = mustFilled.nameProduct.length;
  const maxLengthNumberKandunganGula = mustFilled.kandunganGula.length;
  const maxLengthNumberTakaranSajiGula = mustFilled.takaranSaji.length;
  const maxLengthNumberVolume = mustFilled.volume.length;

  const [errors, setErrors] = useState<object>({
    isNameTooLong: false,
    isSugarTooLong: false,
    isServingSizeTooLong: false,
    isVolumeTooLong: false,
  });

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      isNameTooLong: maxLengthAlphabethNameProduct >= 50,
      isSugarTooLong: maxLengthNumberKandunganGula >= 3,
      isServingSizeTooLong: maxLengthNumberTakaranSajiGula >= 3,
      isVolumeTooLong: maxLengthNumberVolume >= 4,
    }));
  }, [
    maxLengthAlphabethNameProduct,
    maxLengthNumberKandunganGula,
    maxLengthNumberTakaranSajiGula,
    maxLengthNumberVolume,
  ]);

  // Tambah Data
  async function handleAddProduct(event: any) {
    event.preventDefault();
    if (
      !isNaN(event.target.nameProduct.value) ||
      event.target.nameProduct.value.trim() === "" ||
      maxLengthAlphabethNameProduct >= 50 ||
      maxLengthNumberKandunganGula >= 3 ||
      maxLengthNumberTakaranSajiGula >= 3 ||
      maxLengthNumberVolume >= 4
    ) {
      setModalErr(true);
      return;
    }
    setModalSuccess(true);

    const waitForConfirmation = () => {
      return new Promise((resolve) => {
        const onConfirm = () => {
          resolve(true);
        };

        setModalContent(
          <ConfirmAddProduct
            setIsConfirm={setIsConfirm}
            onConfirm={onConfirm}
            setModalSuccess={setModalSuccess}
            mustFilled={mustFilled}
          />
        );
      });
    };

    await waitForConfirmation();

    // pengiriman data
    const gula = Number(event.target.kandunganGula.value);
    const takaranSaji = Number(event.target.takaranSaji.value);
    const totalSugars = gula * takaranSaji;
    const nameProductValue = event.target.nameProduct.value;
    const eachCapitalFirstWord = nameProductValue
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const tipeMinuman = event.target.typeMinuman.value;

    const newProduct = {
      nameProduct: eachCapitalFirstWord,
      sugars: Math.floor(totalSugars),
      volume: Number(event.target.volume.value),
      type: tipeMinuman,
    };

    try {
      const res = await fetch("/api/addData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const resStatus = await res.json();
      setIsStatus(resStatus.status);
    } catch (error) {
      setIsStatus(false);
    }
  }

  // cari data
  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToProducts((data) => {
      setFindData(data);
    });
    return () => unsubscribeDataProductBeverage();
  }, []);

  useEffect(() => {
    if (isStatus !== null) {
      setMustFilled({
        nameProduct: "",
        kandunganGula: "",
        takaranSaji: "",
        volume: "",
      });
    }
  }, [isStatus, setMustFilled]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchProduk(query);

    if (query !== "") {
      const filterSearchProduct = findData.filter(
        (item: productBeverageTypes) => {
          return item.nameProduct
            ?.toLowerCase()
            .startsWith(query.toLowerCase());
        }
      );
      setResult(filterSearchProduct);
    } else {
      setResult([]);
    }
  }

  return (
    <div>
      <NavigasiBar path={path} props={""} />
      <div className="flex flex-col justify-center items-center max-[640px]:h-full sm:h-full md:h-screen mt-16">
        <div className="bg-[#73EC8B] inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10 w-2/5 rounded-xl max-[640px]:my-6 sm:my-6 md:my-0 max-[640px]:w-11/12 sm:w-10/12 md:w-4/5 lg:w-2/3 shadow-lg shadow-slate-800 py-5">
          <h1 className="text-2xl font-semibold text-center max-[640px]:mb-5 sm:mb-7 md:mb-6 max-[640px]:text-xl">
            Penambahan Produk Minuman
          </h1>
          <div className="flex items-center justify-evenly max-[640px]:flex-col-reverse max-[640px]:gap-y-7 sm:flex-col-reverse sm:gap-y-10 md:flex-row md:gap-x-7 md:px-9 lg:px-5">
            <form
              onSubmit={(e) => handleAddProduct(e)}
              className="flex flex-col gap-y-4 basis-1/2 max-[640px]:w-5/6 sm:w-4/5 md:basis-1/2 lg:basis-1/2"
              autoComplete="off"
              ref={inputFieldNone}
            >
              <div className="relative pt-2 font-medium">
                <input
                  type="text"
                  id="nameProduct"
                  className="inputField peer pl-1 pt-2"
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
              <div className="relative pt-2 font-medium">
                <input
                  type="number"
                  id="kandunganGula"
                  className="inputField peer pl-1 pt-1"
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
              <div className="relative pt-2 font-medium">
                <input
                  type="number"
                  min={0.01}
                  max={50}
                  step="0.01"
                  id="takaranSaji"
                  className="inputField peer pl-1 pt-1"
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
              <div className="relative pt-2 font-medium">
                <input
                  type="number"
                  id="volume"
                  className="inputField peer pl-1 pt-1"
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
                  <span>Isi Bersih (ml)</span>
                </label>
                <span className="text-xs font-semibold select-none text-[#F93827]">
                  {/* *Untuk Tipe Minuman Yang Harus Dilarutkan, Lihat Di bagian
                  Petunjuk Penyajian, Yang Berisi Informasi Berapa ml Air Yang
                  Diperlukan. */}
                  *Untuk tipe minuman yang harus dilarutkan, lihat Petunjuk
                  Penyajian untuk jumlah air yang diperlukan.
                </span>
              </div>
              <div className="font-medium">
                <div className="flex gap-x-2 items-center mb-2">
                  <Image
                    width={29}
                    height={20}
                    className="w-[30px]"
                    src={"/images/icon_type.png"}
                    alt="activity"
                  />
                  <label htmlFor="typeMinuman" className="block text-lg">
                    Tipe Minuman
                  </label>
                </div>
                <select
                  id="typeMinuman"
                  className="cursor-pointer bg-[#54C392] rounded-md p-2 text-sm max-[640px]:w-full sm:w-full"
                  value={mustFilled.typeMinuman}
                  onChange={handleValueInput}
                >
                  <option value="" disabled hidden>
                    Pilih Tipe Minuman
                  </option>
                  <option value="Siap Minum">Siap Minum</option>
                  <option value="Harus Dilarutkan">
                    Harus Dilarutkan / Minuman Serbuk
                  </option>
                </select>
              </div>
              <button
                className="bg-green-500 rounded-lg hover:bg-green-600 py-1.5 flex text-lg font-semibold disabled:cursor-not-allowed justify-center items-center gap-2"
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
              <span className="text-[#F93827] font-semibold text-sm text-center">
                *Tolong Untuk Digunakan Secara Bijak
              </span>
            </form>

            {/* check product */}
            <div className="bg-[#54C392] basis-2/5 h-5/6 rounded-lg max-[640px]:w-5/6 sm:w-3/4 md:basis-1/2 lg:basis-2/5">
              <h1 className="py-3 text-center font-semibold text-lg bg-[#15B392] rounded-t-lg">
                Cek Produk Yang Tersedia
              </h1>
              <div className="flex flex-col">
                <form className="relative flex items-center">
                  <input
                    type="text"
                    className="inputField pl-12 pr-10 pb-1 mx-3"
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
                <ul className="m-3 h-60 px-7 py-2 overflow-auto list-decimal scrollBarDesign">
                  {result.map((item: any) => (
                    <li key={item.id}>{item.nameProduct}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {modalSuccess && modalContent}

          {isConfirm && (
            <LayoutModalBoxs>
              {isStatus === true ? (
                <LayoutModalBoxs.ModalAddProductSuccess
                  setModalOnclick={setIsConfirm}
                />
              ) : isStatus === false ? (
                <LayoutModalBoxs.ModalAddProductSame
                  setModalOnclick={setIsConfirm}
                />
              ) : (
                <LayoutModalBoxs.LoadingAnimation />
              )}
            </LayoutModalBoxs>
          )}

          {modalErr && (
            <AddProductError setModalOnclick={setModalErr} errors={errors} />
          )}
        </div>
      </div>
    </div>
  );
}
