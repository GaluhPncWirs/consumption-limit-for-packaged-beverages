import Image from "next/image";

export default function ModalAddProductSuccess({ setModalSucces }) {
  return (
    <div className="bg-green-500 w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/4 z-30 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-1/3">
      <div className="flex justify-center items-center h-3/4 gap-5 max-[640px]:px-5 sm:px-6 md:px-7 lg:px-10">
        <div className="bg-white rounded-full">
          <Image
            src={"/images/check.png"}
            alt="Success"
            width={50}
            height={50}
          />
        </div>
        <div className="text-center">
          <h1 className="font-bold text-xl">Tambah Produk Berhasil</h1>
          <p className="font-medium mt-3">
            Silahkan Kembali ke Pencarian Produk
          </p>
        </div>
      </div>
      <div className="h-1/4 bg-green-400 rounded-b-xl flex justify-center items-center hover:bg-green-600">
        <button
          className="text-xl font-semibold w-full"
          onClick={() => setModalSucces(false)}
        >
          Oke
        </button>
      </div>
    </div>
  );
}
