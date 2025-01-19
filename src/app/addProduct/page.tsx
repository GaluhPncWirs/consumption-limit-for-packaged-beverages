"use client";
import { usePathname } from "next/navigation";
import ButtonBack from "@/components/buttonBack/btn";
import Image from "next/image";

export default function AddProduct() {
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

  const path = usePathname();

  return (
    <div className="background_template h-screen flex flex-col justify-center items-center">
      <div className="bg-green-300 w-1/2 rounded-xl">
        <form
          onSubmit={(e) => handleAddProduct(e)}
          className="py-10 px-10 flex flex-col gap-5"
        >
          <h1 className="text-xl font-semibold text-center mb-3">
            Penambahan Produk Minuman
          </h1>
          <div className="relative w-1/2 pt-3 font-medium">
            <input type="text" id="nameProduct" className="inputField peer" />
            <label
              htmlFor="nameProduct"
              className="labelText flex items-center"
            >
              <Image
                src={"/images/beverage.png"}
                alt="beverage"
                width={30}
                height={30}
              />
              <span>Nama Produk</span>
            </label>
          </div>
          <div className="relative w-1/2 pt-3 font-medium">
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
          <div className="relative w-1/2 pt-3 font-medium">
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
          <div className="relative w-1/2 pt-3 font-medium">
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
              <span>Volume Kemasan Berapa ml</span>
            </label>
          </div>
          <button className="bg-green-500 mt-5 py-1 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all">
            Tambah Produk
          </button>
        </form>
      </div>
      <ButtonBack path={path} props={""} />
    </div>
  );
}
