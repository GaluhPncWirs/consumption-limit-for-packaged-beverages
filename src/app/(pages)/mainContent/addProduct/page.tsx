"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  ChevronRight,
  CircleAlert,
  ClipboardList,
  CupSoda,
  GlassWater,
  Info,
  PackagePlus,
  PackageSearch,
  Plus,
  Search,
  Tags,
} from "lucide-react";
import { DataBeverage } from "../calculateBeverage/page";

const addProductBeverageSchema = z.object({
  nameProduct: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(100, "Maksimal 100 karakter"),
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

type AddProductBeverageInput = z.input<typeof addProductBeverageSchema>;

type AddProductBeverageOutput = z.output<typeof addProductBeverageSchema>;

type AddProductBeverageSchema = z.infer<typeof addProductBeverageSchema>;

export default function AddProduct() {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddProductBeverageInput, unknown, AddProductBeverageOutput>({
    resolver: zodResolver(addProductBeverageSchema),
  });
  const pathname = usePathname();
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [searchResult, setSearchResult] = useState<DataBeverage[]>([]);
  const keyword = watch("searchProduct");

  async function onSubmit(data: AddProductBeverageSchema) {
    const eachCapitalFirstWord = data.nameProduct
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const totalSugars = data.sugarContent * data.servingSize;

    const payload = {
      nameProduct: eachCapitalFirstWord,
      nameProductLowerCase: eachCapitalFirstWord.toLocaleLowerCase(),
      sugars: Math.floor(totalSugars),
      volume: data.volume,
      type: data.beverageType,
    };

    try {
      const res = await fetch("/api/pageAddBeverage/addDataBeverage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const response = await res.json();

      if (!response.status) {
        toast.error("Gagal Tambah Produk", {
          description: response.message,
        });
        return;
      }

      toast.success("Berhasil", {
        description: response.message,
      });

      setOpenResultDialog(false);
    } catch {
      toast.error("❌ Gagal", {
        description: "Fetch API error",
      });
    }
  }

  useEffect(() => {
    if (!keyword) return;

    async function handleSearchNameBeverage() {
      try {
        const req = await fetch("/api/pageCalculate/getDataBeverage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword: keyword,
          }),
        });

        const res = await req.json();

        setSearchResult(res.data);
      } catch {
        toast.error("Gagal fetch data ke API");
      }
    }
    handleSearchNameBeverage();
  }, [keyword]);

  return (
    <MainContentLayout path={pathname}>
      <div className="mx-auto w-full p-5 sm:p-6 lg:p-7 bg-[#f9fff9] rounded-xl">
        {/* Page Header */}
        <div className="mb-8">
          {/* Breadcrumb / Section */}
          <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Produk</span>
            <ChevronRight className="size-3.5" />
            <span className="text-emerald-600">Tambah Produk</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* Title */}
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <PackagePlus className="size-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Tambah Produk Minuman
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                  Tambahkan informasi produk minuman untuk digunakan dalam
                  perhitungan konsumsi gula.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ================================================== */}
          {/* TAMBAH PRODUK                                      */}
          {/* ================================================== */}

          <section className="rounded-3xl shadow-sm">
            {/* Form */}
            <form
              className="w-full space-y-6"
              id="addBeverage"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* ========================================= */}
              {/* PRODUCT INFORMATION */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex justify-center items-center">
                    <PackageSearch className="size-6 shrink-0" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Nama Produk
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Masukkan nama minuman yang akan ditambahkan.
                    </p>
                  </div>
                </div>

                {/* Nama Produk */}
                <FloatingLabel
                  type="text"
                  id="nameProduct"
                  label="Nama Produk"
                  Icon={BottleWine}
                  placeholder=" "
                  register={register("nameProduct")}
                  error={
                    errors.nameProduct as unknown as FieldError | undefined
                  }
                />
              </div>

              {/* ========================================= */}
              {/* PRODUCT CONTENT */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex justify-center items-center">
                      <ClipboardList className="size-6 shrink-0" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-600">
                        Informasi Kandungan
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Pastikan angka sesuai dengan informasi pada kemasan.
                      </p>
                    </div>
                  </div>
                  {/* Numeric Information */}

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
                        errors.servingSize as unknown as FieldError | undefined
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
                        errors.sugarContent as unknown as FieldError | undefined
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
                      error={errors.volume as unknown as FieldError | undefined}
                    />
                  </div>
                </div>
              </div>

              {/* ========================================= */}
              {/* BEVERAGE TYPE */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex justify-center items-center">
                    <Tags className="size-6 shrink-0" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Tipe Minuman
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Pilih bagaimana produk dikonsumsi.
                    </p>
                  </div>
                </div>

                <Controller
                  control={control}
                  name="beverageType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-medium shadow-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${errors.beverageType ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""} `}
                      >
                        <SelectValue placeholder="Pilih tipe minuman" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl p-1">
                        <SelectGroup>
                          <SelectItem
                            value="Siap Minum"
                            className="rounded-lg py-3"
                          >
                            <h3 className="text-sm font-semibold">
                              Siap Minum
                            </h3>

                            <p className="text-xs text-slate-400">
                              Langsung dikonsumsi setelah dibuka
                            </p>
                          </SelectItem>

                          <SelectItem
                            value="Harus Dilarutkan"
                            className="rounded-lg py-3"
                          >
                            <h3 className="text-sm font-semibold">
                              Harus Dilarutkan
                            </h3>

                            <p className="text-xs text-slate-400">
                              Minuman serbuk yang perlu dilarutkan
                            </p>
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
                <Dialog
                  open={openResultDialog}
                  onOpenChange={setOpenResultDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      // disabled={!isFormFilled}
                      className="h-12 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                      <Plus className="size-5" />
                      Tambah Produk
                    </Button>
                  </DialogTrigger>

                  {/* Dialog */}
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
                          <h4 className="text-xs text-slate-500">
                            Nama Produk
                          </h4>

                          <p className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
                            {watch("nameProduct")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                          <h4 className="text-xs text-slate-500">
                            Takaran Saji
                          </h4>

                          <p className="text-sm font-semibold text-slate-800">
                            {watch("servingSize") as number}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                          <h4 className="text-xs text-slate-500">
                            Kandungan Gula
                          </h4>

                          <p className="text-sm font-semibold text-slate-800">
                            {watch("sugarContent") as number} g
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                          <h4 className="text-xs text-slate-500">Isi Bersih</h4>

                          <p className="text-sm font-semibold text-slate-800">
                            {watch("volume") as number} ml
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                          <h4 className="text-xs text-slate-500">
                            Tipe Minuman
                          </h4>

                          <p className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
                            {watch("beverageType")}
                          </p>
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

                      <Button
                        type="submit"
                        form="addBeverage"
                        className="h-11 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Check className="size-5" />
                        Ya, Tambahkan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Disclaimer */}
                <div className="flex items-start justify-center gap-2 px-2">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-slate-400" />

                  <p className="text-xs leading-5 text-slate-400">
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
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-4">
                <Search className="size-6 shrink-0" />
                <div>
                  <h3 className="font-bold tracking-tight text-slate-900">
                    Cek Produk
                  </h3>
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
                {keyword !== "" && (
                  <CommandList className="relative z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    {searchResult.length > 0 ? (
                      <CommandGroup heading="Produk Ditemukan">
                        {searchResult.map((item) => (
                          <CommandItem
                            key={item.id}
                            className="mb-1 cursor-pointer rounded-lg px-3 py-2.5 last:mb-0"
                          >
                            <div>
                              <p className="truncate text-sm font-medium text-slate-700">
                                {item.nameProduct}
                              </p>

                              <p className="text-[11px] text-slate-400">
                                Produk tersedia
                              </p>
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
              {keyword === "" && (
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

        {isSubmitting && <LoadingCompenent />}
      </div>
    </MainContentLayout>
  );
}
