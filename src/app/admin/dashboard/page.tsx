"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useHandleInput } from "@/app/hooks/handle-input";
import { useEffect, useState } from "react";
import {
  pendingDeleteData,
  subscribeToPendingProducts,
} from "@/lib/firebase/services";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ComponentInput from "@/components/input/content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingCompenent from "@/components/loading/content";
import { Button } from "@/components/ui/button";

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

  const [product, setProduct] = useState<any>([]);
  const [isStatus, setIsStatus] = useState<boolean | null>(null);
  const [valueTypeMinuman, setValueTypeMinuman] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [errorInputProduct, setErrorInputProduct] = useState<boolean>(false);

  const maxLengthAlphabethNameProduct = mustFilled.nameProduct.length;
  const maxLengthNumberKandunganGula = mustFilled.kandunganGula.length;
  const maxLengthNumberTakaranSajiGula = mustFilled.takaranSaji.length;
  const maxLengthNumberVolume = mustFilled.volume.length;

  const [errors, setErrors] = useState<any>({
    isNameTooLong: false,
    isSugarTooLong: false,
    isServingSizeTooLong: false,
    isVolumeTooLong: false,
  });

  useEffect(() => {
    setErrors((prev: any) => ({
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
  async function handleAddProduct() {
    if (
      !isNaN(mustFilled.nameProduct) ||
      mustFilled.nameProduct.trim() === "" ||
      maxLengthAlphabethNameProduct >= 50 ||
      maxLengthNumberKandunganGula >= 3 ||
      maxLengthNumberTakaranSajiGula >= 3 ||
      maxLengthNumberVolume >= 4
    ) {
      setErrorInputProduct(true);
      toast("❌ Produk yang ditambahkan tidak valid", {
        description: `
          ${
            errors.isNameTooLong
              ? `Input Nama produk tidak boleh lebih dari 50 karakter`
              : errors.isSugarTooLong
              ? `Input Kandungan gula tidak boleh lebih dari 2 digit`
              : errors.isServingSizeTooLong
              ? `Takaran saji tidak boleh lebih dari 2 digit`
              : errors.isVolumeTooLong
              ? `Input Volume tidak boleh lebih dari 3 digit`
              : `Input Nama Produk Tidak Boleh Kosong dan Tidak Boleh Hanya
                  Berisi Angka!`
          }
          `,
      });
      return;
    }

    setIsConfirm(true);

    // pengiriman data
    const nameProductValue = mustFilled.nameProduct;
    const gula = Number(mustFilled.kandunganGula);
    const takaranSaji = Number(mustFilled.takaranSaji);
    const totalSugars = gula * takaranSaji;
    const eachCapitalFirstWord = nameProductValue
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const newProduct = {
      nameProduct: eachCapitalFirstWord,
      sugars: Math.floor(totalSugars),
      volume: Number(mustFilled.volume),
      type: valueTypeMinuman,
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
      if (resStatus.status) {
        setIsStatus(resStatus.status);
        setIsConfirm(false);
        toast("✅ Berhasil Tambah Produk", {
          description:
            "Data produk telah berhasil di tambahkan, Silahkan kembali ke halaman sebelumnya",
        });
      } else {
        setIsStatus(resStatus.status);
        setIsConfirm(false);
        toast("❌ Gagal Tambah Produk", {
          description:
            "Data produk sudah ada, Silahkan input kembali produk yang berbeda",
        });
      }
    } catch {
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
    if (isStatus !== null || isStatus === true) {
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
    <div className="flex justify-center items-center flex-col-reverse mx-auto py-20 gap-10 lg:flex-row lg:w-10/12 lg:py-0 lg:h-screen">
      <div className="p-7 rounded-lg bg-[#f9fff9] shadow-lg shadow-slate-700 w-11/12 sm:w-10/12 md:w-3/4 lg:w-2/3">
        <h1 className="text-2xl font-semibold text-center mb-5">
          Penambah Produk Minuman
        </h1>
        <form className="flex flex-col gap-y-4 mx-3" autoComplete="off">
          <ComponentInput
            titleInput="Nama Produk"
            srcImg="/images/pageAddProduct/beverage.png"
            altImg="beverage"
            htmlFor="nameProduct"
          >
            <input
              type="text"
              id="nameProduct"
              className="inputField peer"
              onChange={handleValueInput}
              value={mustFilled.nameProduct}
            />
          </ComponentInput>

          <ComponentInput
            titleInput="Kandungan Gula (g)"
            srcImg="/images/pageAddProduct/sugar.png"
            altImg="sugar"
            htmlFor="kandunganGula"
          >
            <input
              type="number"
              id="kandunganGula"
              className="inputField peer"
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
              className="inputField peer"
              onChange={handleValueInput}
              value={mustFilled.takaranSaji}
            />
          </ComponentInput>

          <ComponentInput
            titleInput="Isi Bersih Produk (ml)"
            srcImg="/images/pageAddProduct/ml.png"
            altImg="volume"
            htmlFor="volume"
          >
            <input
              type="number"
              id="volume"
              className="inputField peer"
              onChange={handleValueInput}
              value={mustFilled.volume}
            />
          </ComponentInput>

          <div>
            <div className="flex gap-x-3 mb-3 items-center">
              <Image
                width={200}
                height={200}
                src="/images/pageAddProduct/typeBeverage.png"
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
              value={mustFilled.typeMinuman ?? ""}
              onValueChange={(value) => {
                setValueTypeMinuman(value);
                handleValueInput({
                  target: {
                    id: "typeMinuman",
                    value: value,
                  },
                });
              }}
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

          <Dialog>
            <DialogTrigger asChild>
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
            </DialogTrigger>
            {!errorInputProduct && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Konfirmasi</DialogTitle>
                  <h1 className="tracking-wide text-start">
                    Apakah Data Produk ini Sudah Benar ?
                  </h1>
                  <div className="flex items-center gap-x-6">
                    <Image
                      src="/images/global/warning.png"
                      alt="check"
                      width={200}
                      height={200}
                      className="size-14"
                    />
                    <DialogDescription>
                      <span className="mt-2 flex flex-col items-start gap-y-0.5">
                        <span>
                          Nama Produk :{" "}
                          <span className="font-semibold">
                            {mustFilled.nameProduct}
                          </span>
                        </span>
                        <span>
                          Kandungan Gula (g) :{" "}
                          <span className="font-semibold">
                            {mustFilled.kandunganGula}
                          </span>
                        </span>
                        <span>
                          Takaran Saji Perkemasan :{" "}
                          <span className="font-semibold">
                            {mustFilled.takaranSaji}
                          </span>
                        </span>
                        <span>
                          Isi Bersih Produk (ml) :{" "}
                          <span className="font-semibold">
                            {mustFilled.volume}
                          </span>
                        </span>
                        <span>
                          Tipe Minuman :{" "}
                          <span className="font-semibold">
                            {mustFilled.typeMinuman}
                          </span>
                        </span>
                      </span>
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={handleAddProduct}
                      className="bg-[#54C392] hover:bg-green-500 text-black"
                    >
                      Oke
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
          <span className="text-[#F93827] font-semibold text-sm text-center">
            *Tolong Untuk Digunakan Secara Bijak
          </span>
        </form>
      </div>

      <div className="bg-slate-100 rounded-lg w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 shadow-lg shadow-slate-700">
        <h1 className="p-4 text-center font-semibold text-lg bg-green-400 rounded-t-lg">
          Validasi & Setujui Produk Minuman yang Diajukan Pengguna
        </h1>
        <div className="px-7 py-5 overflow-auto flex flex-col justify-center items-center gap-y-2 rounded-b-lg h-80">
          {product.length === 0 ? (
            <p className="text-xl font-semibold tracking-wide">
              Tidak Ada Produk
            </p>
          ) : (
            product.map((item: any) => (
              <div
                className="flex items-center justify-between w-full"
                key={item.id}
              >
                <h1>{item.nameProduct}</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-4 py-1 bg-green-400 hover:bg-green-500 rounded-md text-slate-800 font-semibold">
                      Detail
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-[640px]:w-11/12 max-[640px]:rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Detail Data Minuman</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <span className="mt-2 flex flex-col items-start gap-y-0.5">
                        <span>
                          Nama Produk :{" "}
                          <span className="font-semibold">
                            {item.nameProduct}
                          </span>
                        </span>
                        <span>
                          Kandungan Gula (g) :{" "}
                          <span className="font-semibold">{item.sugars}</span>
                        </span>

                        <span>
                          Isi Bersih Produk (ml) :{" "}
                          <span className="font-semibold">{item.volume}</span>
                        </span>
                        <span>
                          Tipe Minuman :{" "}
                          <span className="font-semibold">{item.type}</span>
                        </span>
                      </span>
                    </DialogDescription>

                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          className="px-4 py-1 bg-green-300 hover:bg-green-400 rounded-md text-slate-800 font-semibold max-[640px]:mt-3"
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
              </div>
            ))
          )}
        </div>
      </div>

      {isConfirm && <LoadingCompenent />}

      <div className="absolute top-0 right-0 bg-green-400 rounded-bl-lg flex justify-center items-center py-1.5 w-40">
        <button
          className="px-7 bg-red-400 py-1 rounded-lg my-2 font-semibold hover:bg-red-500 text-lg"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
