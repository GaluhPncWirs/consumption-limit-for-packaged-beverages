"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useHandleInput } from "@/app/hooks/getIsFormFilled";
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
import { z } from "zod";
import { Controller, FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FloatingLabel from "@/components/floating-label/component";
import {
  BottleWine,
  Candy,
  Check,
  CircleAlert,
  CupSoda,
  GlassWater,
  Info,
  Package,
  PackageSearch,
  Plus,
  Search,
  Tags,
  Wheat,
} from "lucide-react";

const addProductBeverageSchema = z.object({
  nameProduct: z.string().min(3, "Minimal 3 karakter"),
  sugarContent: z.coerce
    .number()
    .min(1, "Minimal sampai angka 1")
    .max(99, "Maksimal sampai angka 99"),
  servingSize: z.coerce
    .number()
    .min(1, "Minimal sampai angka 1")
    .max(50, "Maksimal sampai angka 50"),
  volume: z.coerce
    .number()
    .int("Harus beerupa angka bulat")
    .min(1, "Minimal sampai angka 1")
    .max(999, "Maksimal sampai angka 999"),
  beverageType: z.string().min(1, "Pilih tipe minuman terlebih dahulu"),

  // optional
  searchProduct: z.string().optional(),
});

type AddProductBeverageSchema = z.infer<typeof addProductBeverageSchema>;

export default function AddProduct() {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddProductBeverageSchema>({
    resolver: zodResolver(addProductBeverageSchema),
  });

  const pathname = usePathname();
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);
  const keyword = watch("searchProduct");

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

  // const [errors, setErrors] = useState({
  //   isNameTooLong: false,
  //   isSugarTooLong: false,
  //   isServingSizeTooLong: false,
  //   isVolumeTooLong: false,
  // });

  // useEffect(() => {
  //   setErrors((prev) => ({
  //     ...prev,
  //     isNameTooLong: maxLengthAlphabethNameProduct >= 50 ? true : false,
  //     isSugarTooLong: maxLengthNumberKandunganGula >= 3 ? true : false,
  //     isServingSizeTooLong: maxLengthNumberTakaranSajiGula >= 3 ? true : false,
  //     isVolumeTooLong: maxLengthNumberVolume >= 4 ? true : false,
  //   }));
  // }, [
  //   maxLengthAlphabethNameProduct,
  //   maxLengthNumberKandunganGula,
  //   maxLengthNumberTakaranSajiGula,
  //   maxLengthNumberVolume,
  // ]);

  // Tambah Data
  // async function handleAddProduct() {
  //   if (
  //     !isNaN(mustFilled.nameProduct) ||
  //     mustFilled.nameProduct.trim() === "" ||
  //     maxLengthAlphabethNameProduct >= 50 ||
  //     maxLengthNumberKandunganGula >= 3 ||
  //     maxLengthNumberTakaranSajiGula >= 3 ||
  //     maxLengthNumberVolume >= 4
  //   ) {
  //     setErrorInputProduct(true);
  //     toast("❌ Produk yang ditambahkan tidak valid", {
  //       description: `
  //       ${
  //         errors.isNameTooLong
  //           ? `Input Nama produk tidak boleh lebih dari 50 karakter`
  //           : errors.isSugarTooLong
  //             ? `Input Kandungan gula tidak boleh lebih dari 2 digit`
  //             : errors.isServingSizeTooLong
  //               ? `Takaran saji tidak boleh lebih dari 2 digit`
  //               : errors.isVolumeTooLong
  //                 ? `Input Volume tidak boleh lebih dari 3 digit`
  //                 : `Input Nama Produk Tidak Boleh Kosong dan Tidak Boleh Hanya
  //               Berisi Angka!`
  //       }
  //       `,
  //     });
  //     return;
  //   }

  //   setIsConfirm(true);

  //   // pengiriman data
  //   const nameProductValue = mustFilled.nameProduct;
  //   const gula = Number(mustFilled.kandunganGula);
  //   const takaranSaji = Number(mustFilled.takaranSaji);
  //   const totalSugars = gula * takaranSaji;
  //   const eachCapitalFirstWord = nameProductValue
  //     .split(" ")
  //     .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");

  //   const newProduct = {
  //     nameProduct: eachCapitalFirstWord,
  //     sugars: Math.floor(totalSugars),
  //     volume: Number(mustFilled.volume),
  //     type: valueTypeMinuman,
  //   };

  //   try {
  //     const res = await fetch("/api/addData", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newProduct),
  //     });
  //     const resStatus = await res.json();
  //     if (resStatus.status) {
  //       setIsStatus(resStatus.status);
  //       setIsConfirm(false);
  //       toast("✅ Berhasil Tambah Produk", {
  //         description:
  //           "Data produk telah berhasil di tambahkan, Silahkan kembali ke halaman sebelumnya",
  //       });
  //     } else {
  //       setIsStatus(resStatus.status);
  //       setIsConfirm(false);
  //       toast("❌ Gagal Tambah Produk", {
  //         description:
  //           "Data produk sudah ada, Silahkan input kembali produk yang berbeda",
  //       });
  //     }
  //   } catch {
  //     setIsStatus(false);
  //   }
  // }

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
        },
      );
      setResult(filterSearchProduct);
    } else {
      setResult([]);
    }
  }

  return (
    <MainContentLayout path={pathname}>
      <div className="flex flex-col justify-center p-5 rounded-lg bg-[#f9fff9] my-10 shadow-lg shadow-slate-700">
        <h1 className="text-2xl font-semibold text-center">
          Penambah Produk Minuman
        </h1>
        <div className="mx-auto mt-7 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:px-5">
          {/* ================================================== */}
          {/* TAMBAH PRODUK                                      */}
          {/* ================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Plus className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Tambah Produk
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Tambahkan produk minuman baru untuk digunakan dalam
                  perhitungan konsumsi gula.
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="w-full space-y-6">
              {/* ========================================= */}
              {/* PRODUCT INFORMATION */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-800">
                    Informasi Produk
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Masukkan informasi dasar produk minuman.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Nama Produk */}
                  <FloatingLabel
                    type="text"
                    id="nameProduct"
                    label="Nama Produk"
                    Icon={Package}
                    placeholder=" "
                    register={register("nameProduct")}
                    error={
                      errors.nameProduct as unknown as FieldError | undefined
                    }
                  />

                  {/* Numeric Information */}
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-slate-600">
                        Informasi Kandungan
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Pastikan angka sesuai dengan informasi pada kemasan.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Takaran Saji */}
                      <FloatingLabel
                        type="number"
                        id="servingSize"
                        label="Takaran Saji"
                        Icon={CupSoda}
                        placeholder=" "
                        register={register("servingSize")}
                        error={
                          errors.servingSize as unknown as
                            | FieldError
                            | undefined
                        }
                      />

                      {/* Kandungan Gula */}
                      <FloatingLabel
                        type="number"
                        id="contentSugar"
                        label="Kandungan Gula"
                        desc="g"
                        Icon={Candy}
                        placeholder=" "
                        register={register("sugarContent")}
                        error={
                          errors.sugarContent as unknown as
                            | FieldError
                            | undefined
                        }
                      />

                      {/* Isi Bersih */}
                      <FloatingLabel
                        type="number"
                        id="volume"
                        label="Isi Bersih"
                        desc="ml"
                        Icon={GlassWater}
                        placeholder=" "
                        register={register("volume")}
                        error={
                          errors.volume as unknown as FieldError | undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* BEVERAGE TYPE */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-800">
                    Tipe Minuman
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Pilih bagaimana produk dikonsumsi.
                  </p>
                </div>

                <Controller
                  control={control}
                  name="beverageType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`
              h-12
              rounded-xl
              border-slate-200
              bg-slate-50
              px-4
              text-sm
              font-medium
              shadow-none
              transition-all

              hover:border-slate-300
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10

              ${
                errors.beverageType
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : ""
              }
            `}
                      >
                        <SelectValue placeholder="Pilih tipe minuman" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl p-1">
                        <SelectGroup>
                          <SelectItem
                            value="Siap Minum"
                            className="rounded-lg py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <BottleWine className="size-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold">
                                  Siap Minum
                                </p>

                                <p className="text-xs text-slate-400">
                                  Langsung dikonsumsi setelah dibuka
                                </p>
                              </div>
                            </div>
                          </SelectItem>

                          <SelectItem
                            value="Harus Dilarutkan"
                            className="rounded-lg py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                <Wheat className="size-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold">
                                  Harus Dilarutkan
                                </p>

                                <p className="text-xs text-slate-400">
                                  Minuman serbuk yang perlu dilarutkan
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.beverageType && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.beverageType.message}
                  </p>
                )}
              </div>

              {/* ========================================= */}
              {/* ACTION */}
              {/* ========================================= */}

              <div className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      disabled={!isFormFilled}
                      className="
            h-12
            w-full
            rounded-xl
            bg-emerald-500
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-emerald-500/20
            transition-all

            hover:bg-emerald-600
            active:scale-[0.99]

            disabled:cursor-not-allowed
            disabled:bg-slate-200
            disabled:text-slate-400
            disabled:shadow-none
          "
                    >
                      <Plus className="size-5" />
                      Tambah Produk
                    </Button>
                  </DialogTrigger>

                  {/* Dialog */}
                  {!errorInputProduct && (
                    <DialogContent className="max-w-md rounded-2xl">
                      <DialogHeader>
                        {/* Icon */}
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                          <CircleAlert className="size-6" />
                        </div>

                        <DialogTitle className="mt-3 text-center text-lg">
                          Periksa Data Produk
                        </DialogTitle>

                        <DialogDescription className="text-center text-sm leading-6">
                          Pastikan informasi produk berikut sudah sesuai dengan
                          data pada kemasan.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Summary */}
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                        <div className="divide-y divide-slate-100">
                          <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-xs text-slate-500">
                              Nama Produk
                            </span>

                            <span className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
                              {mustFilled.nameProduct}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-xs text-slate-500">
                              Kandungan Gula
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                              {mustFilled.kandunganGula} g
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-xs text-slate-500">
                              Takaran Saji
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                              {mustFilled.takaranSaji}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-xs text-slate-500">
                              Isi Bersih
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                              {mustFilled.volume} ml
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-xs text-slate-500">
                              Tipe Minuman
                            </span>

                            <span className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
                              {mustFilled.typeMinuman}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <DialogFooter className="mt-5 flex-col-reverse gap-2 sm:flex-row">
                        <DialogClose asChild>
                          <Button variant="outline" className="h-11 rounded-xl">
                            Periksa Lagi
                          </Button>
                        </DialogClose>

                        <DialogClose asChild>
                          <Button
                            // onClick={handleAddProduct}
                            className="h-11 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                          >
                            <Check className="size-4" />
                            Ya, Tambahkan
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>

                {/* Disclaimer */}
                <div className="flex items-start justify-center gap-2 px-2">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-slate-400" />

                  <p className="text-center text-xs leading-5 text-slate-400">
                    Pastikan data produk yang dimasukkan sesuai dengan informasi
                    pada kemasan.
                  </p>
                </div>
              </div>
            </form>
          </section>

          {/* ================================================== */}
          {/* CEK PRODUK                                         */}
          {/* ================================================== */}

          <section className="flex h-fit flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Search className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    Cek Produk
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Cari produk yang sudah tersedia sebelum menambah data baru.
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-5 sm:p-6">
              <Command className="overflow-visible bg-transparent">
                <FloatingLabel
                  type="text"
                  id="search"
                  label="Cari Produk Minuman"
                  Icon={Search}
                  placeholder=" "
                  register={register("searchProduct")}
                  error={
                    errors.searchProduct as unknown as FieldError | undefined
                  }
                />

                <p className="mt-2 px-1 text-xs leading-5 text-slate-400">
                  Cari berdasarkan nama produk atau merek minuman.
                </p>

                {/* Search Result */}
                {isOpenSearchProduct && keyword !== "" && (
                  <CommandList className="relative z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    {result.length > 0 ? (
                      <CommandGroup heading="Produk Ditemukan">
                        {result.map((item: productBeverageTypes) => (
                          <CommandItem
                            key={item.id}
                            className="mb-1 cursor-pointer rounded-lg px-3 py-2.5 last:mb-0"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <Package className="size-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-700">
                                  {item.nameProduct}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  Produk tersedia
                                </p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty className="py-8 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
                            <Search className="size-4 text-slate-400" />
                          </div>

                          <p className="mt-3 text-sm font-medium text-slate-600">
                            Produk tidak ditemukan
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Coba gunakan nama atau merek yang berbeda.
                          </p>
                        </div>
                      </CommandEmpty>
                    )}
                  </CommandList>
                )}
              </Command>

              {/* Initial State */}
              {!isOpenSearchProduct && (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
                    <PackageSearch className="size-6" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Cari produk yang tersedia
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Gunakan kolom pencarian di atas untuk memastikan produk
                    belum tersedia.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {isConfirm && <LoadingCompenent />}
      </div>
    </MainContentLayout>
  );
}
