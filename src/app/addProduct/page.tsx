"use client";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <div className="background_template h-screen flex flex-col justify-center items-center">
      <div className="bg-slate-300 w-1/2 rounded-xl">
        <form
          onSubmit={(e) => handleAddProduct(e)}
          className="py-10 px-10 flex flex-col gap-5"
        >
          <h1 className="text-xl font-semibold text-center mb-3">
            Penambahan Produk Minuman
          </h1>
          <div className="relative w-1/2 pt-3 font-medium">
            <input type="text" id="nameProduct" className="inputField peer" />
            <label htmlFor="nameProduct" className="labelText">
              Nama Produk
            </label>
          </div>
          <div className="relative w-1/2 pt-3 font-medium">
            <input
              type="number"
              id="kandunganGula"
              className="inputField peer"
            />
            <label htmlFor="kandunganGula" className="labelText">
              Kandungan Gula Minuman
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
            <label htmlFor="takaranSaji" className="labelText">
              Takaran Saji Per Kemasan
            </label>
          </div>
          <div className="relative w-1/2 pt-3 font-medium">
            <input type="number" id="volume" className="inputField peer" />
            <label htmlFor="volume" className="labelText">
              Volume Kemasan Berapa ml
            </label>
          </div>
          <button className="bg-slate-50 mt-5 py-1 rounded-lg text-lg font-semibold hover:bg-blue-400 transition-all">
            Tambah Produk
          </button>
        </form>
      </div>
      <div className="absolute top-0 left-0 px-3 bg-slate-100 py-1.5 hover:bg-blue-400 rounded-br-lg flex flex-row-reverse justify-center items-center gap-1 cursor-pointer">
        <Link href={"./mainContent"} className="text-xl font-semibold">
          Kembali
        </Link>
        <Image
          src="/images/arrow_left.png"
          alt="arrow_left"
          className="w-1/5"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
