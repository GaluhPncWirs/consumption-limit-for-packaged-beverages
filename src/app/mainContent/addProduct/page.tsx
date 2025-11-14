"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useHandleInput } from "@/app/hooks/handle-input";
import LayoutModalBoxs from "@/components/modalBox/layout";
import { useEffect, useRef, useState } from "react";
import AddProductError from "@/components/modalBox/layoutVertical/modalErrVer/addError";
import ConfirmAddProduct from "@/components/modalBox/layoutVertical/modalConfirm/confirm";
import { productBeverageTypes } from "@/types/dataTypes";
import { subscribeToProducts } from "@/lib/firebase/services";
import MainContentLayout from "@/layout/mainContent";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ComponentInput from "@/components/input/content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProduct() {
  const pathname = usePathname();
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
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);

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
      const res = await fetch("/api/products/submitUser", {
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
    <MainContentLayout path={pathname}>
      <div className="flex flex-col justify-center p-7 rounded-lg bg-[#f9fff9] my-10 shadow-lg shadow-slate-700 max-[640px]:p-5">
        <h1 className="text-2xl font-semibold text-center">
          Penambah Produk Minuman
        </h1>
        <div className="flex items-center justify-evenly mt-7 flex-col-reverse gap-7 md:flex-row md:px-9 lg:px-5">
          <form
            onSubmit={(e) => handleAddProduct(e)}
            className="flex flex-col gap-y-4 basis-1/2 max-[640px]:w-5/6 sm:w-4/5 md:basis-1/2 lg:basis-1/2"
            autoComplete="off"
            ref={inputFieldNone}
          >
            <ComponentInput
              titleInput="Nama Produk"
              srcImg="/images/pageAddProduct/beverage.png"
              altImg="beverage"
              htmlFor="nameProduct"
            >
              <input
                type="text"
                id="nameProduct"
                className="inputField peer pl-1 pt-2"
                onChange={handleValueInput}
                value={mustFilled.nameProduct}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Kandungan Gula"
              srcImg="/images/pageAddProduct/sugar.png"
              altImg="sugar"
              htmlFor="kandunganGula"
            >
              <input
                type="number"
                id="kandunganGula"
                className="inputField peer pl-1 pt-1"
                onChange={handleValueInput}
                value={mustFilled.kandunganGula}
              />
            </ComponentInput>

            <ComponentInput
              titleInput="Takaran Saji Perkemasan"
              srcImg="/images/pageAddProduct/serving.png"
              altImg="takaranSaji"
              htmlFor="takaranSaji"
            >
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
            </ComponentInput>

            <ComponentInput
              titleInput="Takaran Saji Perkemasan"
              srcImg="/images/pageAddProduct/ml.png"
              altImg="volume"
              htmlFor="volume"
            >
              <input
                type="number"
                id="volume"
                className="inputField peer pl-1 pt-1"
                onChange={handleValueInput}
                value={mustFilled.volume}
              />
            </ComponentInput>

            <div>
              <div className="flex gap-x-3 mb-3 items-center">
                <Image
                  width={200}
                  height={200}
                  src="/images/pageAddProduct/icon_type.png"
                  alt="type"
                  className="size-8"
                />
                <label
                  htmlFor="typeMinuman"
                  className="inline-block text-lg font-semibold"
                >
                  Tipe Minuman
                </label>
              </div>
              <Select
                value={mustFilled.activityLevel}
                // onValueChange={(value) => {
                //   setSelectedValueActivityLevel(value);
                //   handleValueInput({
                //     target: {
                //       id: "activityLevel",
                //       value: value,
                //     },
                //   });
                // }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tipe Minuman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Siap Minum">Siap Minum</SelectItem>
                    <SelectItem value="Harus Dilarutkan">
                      Harus Dilarutkan / Minuman Serbuk
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="font-medium">
              <div className="flex gap-x-2 items-center mb-2">
                <Image
                  width={29}
                  height={20}
                  className="w-[30px]"
                  src="/images/pageAddProduct/icon_type.png"
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
            </div> */}
            <button
              className="bg-green-400 rounded-lg hover:bg-green-500 py-1.5 flex text-lg font-semibold disabled:cursor-not-allowed justify-center items-center gap-2"
              disabled={!isFormFilled()}
            >
              <Image
                src="/images/pageAddProduct/add-product.png"
                alt="add Product"
                width={200}
                height={200}
                className="size-8"
              />
              <span>Tambah Produk</span>
            </button>
            <span className="text-[#F93827] font-semibold text-sm text-center">
              *Tolong Untuk Digunakan Secara Bijak
            </span>
          </form>

          {/* check product */}
          <div className="bg-slate-100 rounded-lg w-11/12 md:w-1/2 h-96">
            <h1 className="py-3 text-center font-semibold text-lg rounded-t-lg bg-green-400">
              Cek Produk Yang Tersedia
            </h1>
            <div>
              <Command>
                <CommandInput
                  placeholder="Cari Produk..."
                  onChangeCapture={handleInputChange}
                  value={searchProduk}
                />
                {isOpenSearchProduct && (
                  <CommandList className="p-3 bg-slate-200 z-10 text-[#333333] font-medium min-h-72">
                    {result.length > 0 ? (
                      <CommandGroup heading="Cek Produk">
                        {result.map((item: productBeverageTypes) => (
                          <CommandItem
                            key={item.id}
                            className="cursor-pointer mb-1"
                          >
                            {item.nameProduct}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>Produk Minuman Belum Ada.</CommandEmpty>
                    )}
                  </CommandList>
                )}
              </Command>
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
    </MainContentLayout>
  );
}
