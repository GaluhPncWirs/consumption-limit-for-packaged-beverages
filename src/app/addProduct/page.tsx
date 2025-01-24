"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import NavigasiBar from "@/components/navbar/navigasiBar";

export default function AddProduct() {
  const path = usePathname();
  async function handleAddProduct(event: any) {
    event.preventDefault();

    const gula = event.target.kandunganGula.value;
    const takaranSaji = event.target.takaranSaji.value;

    const totalSugars = gula * takaranSaji;

    const res = await fetch("/api/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameProduct: event.target.nameProduct.value,
        sugars: Math.floor(totalSugars),
        volume: Number(event.target.volume.value),
      }),
    });

    const resStatus = await res.json();
    if (resStatus.status) {
      console.log(resStatus.message);
    } else {
      console.log(resStatus.message);
    }
  }

  return (
    <div>
      <NavigasiBar path={path} props={""} />
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="bg-green-300 w-2/5 rounded-xl mt-16 max-[640px]:w-11/12 sm:w-4/5 md:w-8/12 lg:w-1/2">
          <form
            onSubmit={(e) => handleAddProduct(e)}
            className="p-14 flex flex-col gap-5"
          >
            <h1 className="text-xl font-semibold text-center mb-3">
              Penambahan Produk Minuman
            </h1>
            <div className="relative pt-3 font-medium">
              <input type="text" id="nameProduct" className="inputField peer" />
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
              />
              <label
                htmlFor="nameProduct"
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
              />
              <label
                htmlFor="nameProduct"
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
              <input type="number" id="volume" className="inputField peer" />
              <label
                htmlFor="nameProduct"
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
            <button className="bg-green-500 mt-5 py-1 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all">
              Tambah Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
