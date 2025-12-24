import { useHandleInput } from "@/app/hooks/handle-input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ComponentInput from "@/layout/input/content";
import { subscribeToProducts } from "@/lib/firebase/services";
import { productBeverageTypes } from "@/types/dataTypes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function InputProductBeverageComp({
  handleCalculateProductBeverage,
  handleInputChange,
  result,
}: any) {
  const [searchProduk, setSearchProduk] = useState<string>("");
  const [selectedProduct, setSelectedProduct] =
    useState<productBeverageTypes | null>(null);

  const [sugar, setSugar] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const listNameProduct = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [servingSize, setServingSize] = useState<boolean>(false);
  const focusInput = useRef<HTMLInputElement>(null);
  const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(true);
  const { isFormFilled, setMustFilled } = useHandleInput({
    product: "",
  });

  useEffect(() => {
    setMustFilled((prev: Object) => ({ ...prev, product: searchProduk }));
  }, [searchProduk, setMustFilled]);

  //   function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  //     const query = e.target.value;
  //     setSearchProduk(query);

  //     if (query !== "") {
  //       const filterSearchProduct = product.filter(
  //         (item: productBeverageTypes) => {
  //           return item.nameProduct
  //             ?.toLowerCase()
  //             .startsWith(query.toLowerCase());
  //         }
  //       );
  //       setResult(filterSearchProduct);
  //       setActiveIndex(-1);
  //     } else {
  //       setResult([]);
  //     }
  //   }

  function scrollToActiveItem(index: number) {
    const listProduct = listNameProduct.current;
    if (listProduct) {
      const activeItemProd = listProduct.children[index] as HTMLElement;
      if (activeItemProd) {
        activeItemProd.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }

  useEffect(() => {
    function handleKeyEvent(e: KeyboardEvent) {
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
          setIsOpenSearchProduct(false);
        } else {
          setIsOpenSearchProduct(true);
        }
      }
    }

    document.addEventListener("keydown", handleKeyEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, [result, activeIndex]);

  function handleItemClick(item: productBeverageTypes) {
    setSelectedProduct(item);
    setSearchProduk(item.nameProduct);
    setIsOpenSearchProduct(false);
  }

  useEffect(() => {
    if (selectedProduct) {
      setSearchProduk(selectedProduct.nameProduct);
      setSugar(selectedProduct.sugars);
      setVolume(selectedProduct.volume);
      setType(selectedProduct.type);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (searchProduk === "") {
      setSelectedProduct(null);
    }
  }, [searchProduk]);

  return (
    <form
      className="basis-2/5"
      autoComplete="off"
      onSubmit={(e) => handleCalculateProductBeverage(e)}
    >
      <div className="flex flex-col gap-y-5 items-center justify-center">
        <ComponentInput
          titleInput="Cari Produk"
          srcImg="/images/global/search.png"
          altImg="Cari"
          htmlFor="product"
        >
          <Command>
            <input
              type="text"
              className="inputField peer"
              id="product"
              value={searchProduk}
              onChange={handleInputChange}
              required
              ref={focusInput}
            />
            {isOpenSearchProduct && (
              <div>
                {searchProduk !== "" && (
                  <CommandList
                    className="p-3 bg-slate-200 absolute z-10 w-full text-[#333333] font-medium max-h-40 overflow-y-auto rounded-b-lg"
                    ref={listNameProduct}
                  >
                    {result.length > 0 ? (
                      <CommandGroup heading="Pilih Produk">
                        {result.map((item: productBeverageTypes, i: number) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleItemClick(item)}
                            className={`cursor-pointer mb-1 ${
                              activeIndex === i ? "bg-slate-100" : ""
                            }`}
                          >
                            {item.nameProduct}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>Produk Tidak Ada.</CommandEmpty>
                    )}
                  </CommandList>
                )}
              </div>
            )}
          </Command>
        </ComponentInput>

        <ComponentInput
          titleInput="Kadar Gula (G)"
          srcImg="/images/pageAddProduct/sugar.png"
          altImg="sugar"
          htmlFor="sugarContent"
        >
          <input
            type="number"
            id="sugarContent"
            className="inputField"
            readOnly
            disabled
            value={sugar || ""}
          />
          <div className="text-xs mt-1.5">
            <h1
              className="tracking-wide text-[#F93827] font-semibold cursor-pointer mb-1"
              onClick={() => setServingSize((prev) => !prev)}
            >
              * Gula Disini Sudah di Totalkan Dengan Takaran Saji Per Kemasan
            </h1>
            {servingSize && (
              <p className="text-justify ">
                Jika minuman yang takaran sajinya itu 3 per kemasan dan
                kandungan gulanya 10g maka 3 X 10 yaitu total gulanya menjadi
                30g gula
              </p>
            )}
          </div>
        </ComponentInput>

        <ComponentInput
          titleInput="Isi Bersih (ml)"
          srcImg="/images/pageAddProduct/ml.png"
          altImg="isi Bersih"
          htmlFor="isiBeratBersih"
        >
          <input
            type="number"
            id="isiBeratBersih"
            className="inputField"
            readOnly
            disabled
            value={volume || ""}
          />
        </ComponentInput>

        <ComponentInput
          titleInput="Tipe Minuman"
          srcImg="/images/pageAddProduct/typeBeverage.png"
          altImg="Tipe"
          htmlFor="type"
        >
          <input
            id="type"
            className="inputField"
            readOnly
            disabled
            value={type || ""}
          />
        </ComponentInput>

        <h1 className="text-sm w-full">
          Produk yang di cari tidak ada?{" "}
          <Link
            href={"/mainContent/addProduct"}
            className="text-blue-600 hover:underline font-semibold"
          >
            klik disini
          </Link>{" "}
          untuk menambahkan produk
        </h1>
      </div>

      <button
        type="submit"
        className="disabled:cursor-not-allowed py-1.5 text-center rounded-md bg-green-400 hover:bg-green-500 cursor-pointer font-semibold tracking-wider px-7 text-lg mx-2 w-32 mt-7"
        disabled={!isFormFilled()}
      >
        Hitung
      </button>
    </form>
  );
}
