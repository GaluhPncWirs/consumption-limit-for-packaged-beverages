"use client";

import Image from "next/image";

export default function PageRemoveProduct() {
  function handleDeleteProduct(event: any) {
    event.preventdefault();
  }

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="bg-green-300 w-2/5 rounded-xl mt-7 max-[640px]:w-11/12 sm:w-4/5 md:w-8/12 lg:w-1/2">
          <form
            onSubmit={(e) => handleDeleteProduct(e)}
            className="p-12 flex flex-col gap-y-5"
            autoComplete="off"
          >
            <h1 className="text-xl font-semibold text-center mb-3">
              Menghapus Produk Minuman
            </h1>
            <div className="relative pt-3 font-medium">
              <input
                type="text"
                id="nameProduct"
                className="inputField peer"
                // onChange={handleValueInput}
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
            <div className="relative pt-3 font-medium">
              <input
                type="number"
                id="kandunganGula"
                className="inputField peer"
                // onChange={handleValueInput}
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
            <div className="relative pt-3 font-medium">
              <input
                type="number"
                min={0.01}
                max={50}
                step="0.01"
                id="takaranSaji"
                className="inputField peer"
                // onChange={handleValueInput}
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
            <div className="relative pt-3 font-medium">
              <input
                type="number"
                id="volume"
                className="inputField peer"
                // onChange={handleValueInput}
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
                <span>Volume Kemasan (ml)</span>
              </label>
            </div>
            <button className="bg-green-500 mt-5 rounded-lg hover:bg-green-600 py-1.5 flex text-lg font-semibold justify-center items-center gap-2">
              <Image
                src={"/images/add-product.png"}
                alt="add Product"
                width={30}
                height={30}
                className="bg-cover"
              />
              <span>Tambah Produk</span>
            </button>
            <span className="text-red-500 font-semibold text-sm">
              *Tolong Untuk Digunakan Secara Bijak
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
