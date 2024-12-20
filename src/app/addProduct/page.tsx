"use client";

import Link from "next/link";

export default function AddProduct() {
  async function handleAddProduct(event: any) {
    event.preventDefault();

    const gula = event.target.sugars.value;
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
          <label htmlFor="takaranSaji">Takaran Saji Per Kemasan</label>
          <input
            type="number"
            id="takaranSaji"
            min={0.01}
            max={50}
            step="0.01"
          />
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
