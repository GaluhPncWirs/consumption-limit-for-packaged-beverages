"use client";

import Link from "next/link";

export default function AddProduct() {
  async function handleAddProduct(event: any) {
    event.preventDefault();
    const res = await fetch("/api/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameProduct: event.target.nameProduct.value,
        sugars: event.target.sugars.value,
        volume: event.target.volume.value,
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
    <div className="bg-blue-300">
      <form action="" onSubmit={(e) => handleAddProduct(e)}>
        <div>
          <label htmlFor="nameProduct">nama produk</label>
          <input type="text" id="nameProduct" />
        </div>
        <div>
          <label htmlFor="sugars">kandungan gula minuman</label>
          <input type="number" id="sugars" />
        </div>
        <div>
          <label htmlFor="volume">volume kemasan berapa ml</label>
          <input type="number" id="volume" />
        </div>
        <button>tambah</button>
      </form>
      <div>
        <Link href={"./mainContent"}>Kembali</Link>
      </div>
    </div>
  );
}
