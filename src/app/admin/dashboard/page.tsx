"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import NavigasiBar from "@/components/navbar/navigasiBar";
import { useHandleInput } from "@/app/hooks/handle-input";
import LayoutModalBoxs from "@/components/modalBox/layout";
import { useEffect, useRef, useState } from "react";
import AddProductError from "@/components/modalBox/layoutVertical/modalErrVer/addError";
import ConfirmAddProduct from "@/components/modalBox/layoutVertical/modalConfirm/confirm";
import {
  pendingDeleteData,
  subscribeToPendingProducts,
} from "@/lib/firebase/services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";

export default function AdminPage() {
  const { push } = useRouter();
  const { mustFilled, handleValueInput, isFormFilled, setMustFilled } =
    useHandleInput({
      nameProduct: "",
      kandunganGula: "",
      takaranSaji: "",
      volume: "",
      typeMinuman: "",
    });

  const [modalErr, setModalErr] = useState<boolean>(false);
  const [product, setProduct] = useState<any>([]);
  const [isStatus, setIsStatus] = useState<boolean | null>(null);
  const inputFieldNone = useRef(null);
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

  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToPendingProducts(
      (dataProduct) => {
        setProduct(dataProduct);
      }
    );

    return () => unsubscribeDataProductBeverage();
  }, []);

  async function deleteProd(productName: string) {
    toast("Berhasil ✅", {
      description: `Data Produk ${productName} Telah Di Hapus`,
    });
    return await pendingDeleteData(productName);
  }

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

  async function acceptData(idProd: any, name: string) {
    const choosenProduct = product.find(
      (idProduct: any) => idProduct.id === idProd
    );

    if (!choosenProduct) {
      setIsStatus(false);
      return;
    }
    try {
      const res = await fetch("/api/addData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(choosenProduct),
      });
      const resStatus = await res.json();
      setIsStatus(resStatus.status);

      if (resStatus.status) {
        await pendingDeleteData(name);
        toast("Berhasil ✅", {
          description: `Data Produk ${name} Telah Ditambahkan`,
        });
      }
    } catch (error) {
      setIsStatus(false);
    }
  }

  function handleLogout() {
    document.cookie = "isLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    push("/admin/login");
  }

  return (
    <div className="flex justify-center items-center max-[640px]:h-full sm:h-full lg:h-screen max-[640px]:flex-col sm:flex-col md:flex-row md:gap-x-10">
      <Toaster />
      <div className="bg-[#73EC8B] inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10 rounded-xl max-[640px]:my-6 sm:my-6 md:my-5 max-[640px]:w-11/12 sm:w-10/12 md:w-2/3 lg:w-[45%] shadow-lg shadow-slate-800 lg:pb-8 lg:pt-6">
        <h1 className="text-2xl font-semibold text-center max-[640px]:mb-5 sm:mb-7 md:mb-6 max-[640px]:text-xl">
          Penambahan Produk Minuman
        </h1>
        <div className="flex items-center justify-center">
          <form
            onSubmit={(e) => handleAddProduct(e)}
            className="flex flex-col gap-y-4 max-[640px]:w-5/6 sm:w-4/5"
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
          </form>
        </div>
      </div>
      <div className="bg-[#73EC8B] inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10 rounded-xl max-[640px]:my-6 sm:my-6 md:my-5 max-[640px]:w-11/12 sm:w-10/12 md:w-1/3 lg:w-1/3 shadow-lg shadow-slate-800 pb-3">
        <h1 className="p-3 text-center font-semibold text-lg bg-[#15B392] rounded-t-lg">
          Validasi & Setujui Produk Minuman yang Diajukan Pengguna
        </h1>
        <div className="flex flex-col">
          <ul className="m-3 h-80 px-7 py-2 overflow-auto scrollBarDesign">
            {product.map((item: any) => (
              <li className="flex justify-between items-center" key={item.id}>
                <h1>{item.nameProduct}</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-4 py-1 bg-green-500 hover:bg-green-600 rounded-md text-slate-800 font-semibold">
                      Detail
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detail Data Minuman</DialogTitle>
                    </DialogHeader>
                    <ul>
                      <li>
                        Nama Produk : <span>{item.nameProduct}</span>
                      </li>
                      <li>
                        Kandungan Gula Minuman : <span>{item.sugars} gram</span>
                      </li>
                      <li>
                        Isi Bersih (ml) : <span>{item.volume} ml</span>
                      </li>
                      <li>
                        Tipe Minuman : <span>{item.type}</span>
                      </li>
                    </ul>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          className="px-4 py-1 bg-green-300 hover:bg-green-400 rounded-md text-slate-800 font-semibold"
                          onClick={() => acceptData(item.id, item.nameProduct)}
                        >
                          Accept
                        </button>
                      </DialogClose>
                      <DialogClose asChild>
                        <button
                          className="px-4 py-1 bg-red-400 hover:bg-red-500 rounded-md text-slate-800 font-semibold"
                          onClick={() => deleteProd(item.nameProduct)}
                        >
                          Delete
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/6 bg-green-400 rounded-bl-lg flex justify-center items-center py-1">
        <button
          className="px-10 bg-red-400 py-1 rounded-lg my-2 font-semibold hover:bg-red-500 text-lg"
          onClick={handleLogout}
        >
          Keluar
        </button>
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
  );
}
