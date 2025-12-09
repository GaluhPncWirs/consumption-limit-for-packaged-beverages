"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useHandleInput } from "@/app/hooks/handle-input";
import { useEffect, useState } from "react";
import { productBeverageTypes } from "@/types/dataTypes";
import { subscribeToProducts } from "@/lib/firebase/services";
import MainContentLayout from "@/layout/mainSystem/content";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ComponentInput from "@/layout/input/content";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import LoadingCompenent from "@/components/loading/content";

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

  const [isStatus, setIsStatus] = useState<boolean | null>(null);
  const [findData, setFindData] = useState<productBeverageTypes[]>([]);
  const [searchProduk, setSearchProduk] = useState<string>("");
  const [result, setResult] = useState<productBeverageTypes[]>([]);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [valueTypeMinuman, setValueTypeMinuman] = useState<string>("");
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
      isNameTooLong: maxLengthAlphabethNameProduct >= 50 ? true : false,
      isSugarTooLong: maxLengthNumberKandunganGula >= 3 ? true : false,
      isServingSizeTooLong: maxLengthNumberTakaranSajiGula >= 3 ? true : false,
      isVolumeTooLong: maxLengthNumberVolume >= 4 ? true : false,
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
        console.log(resStatus.message);
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

  // cari data
  useEffect(() => {
    const unsubscribeDataProductBeverage = subscribeToProducts((data) => {
      setFindData(data);
    });
    return () => unsubscribeDataProductBeverage();
  }, []);

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
        <div className="flex items-center justify-evenly mt-7 flex-col-reverse gap-7 lg:flex-row lg:px-5">
          <form
            className="flex flex-col gap-y-4 w-11/12 lg:w-1/2"
            autoComplete="off"
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
                onValueChange={(value: any) => {
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
                <SelectContent className="px-2">
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

          {/* check product */}
          <div className="bg-slate-100 rounded-lg w-11/12 lg:w-1/2 h-96 shadow-lg shadow-slate-700">
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
              </Command>
            </div>
          </div>
        </div>

        {isConfirm && <LoadingCompenent />}
      </div>
    </MainContentLayout>
  );
}
