import Image from "next/image";
import ButtonModalBoxs from "@/components/button/btnModal";
import IconWarning from "../warningIcon/icon";

export default function LayoutModalBoxs({ children }) {
  return (
    <div className="bg-green-500 w-1/3 rounded-xl absolute top-1/2 left-1/2 h-2/5 z-30 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-1/3">
      <div className="h-full max-[640px]:px-3 sm:px-4 md:px-5 lg:px-8">
        {children}
      </div>
    </div>
  );
}

function ModalAddProductSame({ setModalOnclick }) {
  return (
    <div className="h-full flex flex-col gap-3 py-4 justify-center">
      <IconWarning />
      <div className="text-center">
        <h1 className="font-bold text-xl">Produk Yang Ditambahkan Sudah Ada</h1>
        <p className="font-medium mt-3">
          Silahkan Input Kembali Produk Yang Berbeda
        </p>
      </div>
      <ButtonModalBoxs setModalOnclick={setModalOnclick} />
    </div>
  );
}

function ModalAddProductSuccess({ setModalOnclick }) {
  return (
    <div className="h-full flex flex-col gap-3 py-4 justify-center">
      <div className="rounded-full flex justify-center">
        <Image
          src={"/images/check.png"}
          alt="Success"
          width={50}
          height={50}
          className="bg-white rounded-full"
        />
      </div>
      <div className="text-center">
        <h1 className="font-bold text-xl">Tambah Produk Berhasil</h1>
        <p className="font-medium mt-3">Silahkan Kembali ke Pencarian Produk</p>
      </div>
      <ButtonModalBoxs setModalOnclick={setModalOnclick} />
    </div>
  );
}

function LoadingAnimation() {
  return (
    <div className="w-full flex justify-center items-center h-full">
      <Image
        src={"/images/loading.png"}
        alt="Loading"
        width={90}
        height={90}
        className="rounded-full animate-[spin_1s_linear_infinite]"
      />
    </div>
  );
}

LayoutModalBoxs.ModalAddProductSame = ModalAddProductSame;
LayoutModalBoxs.ModalAddProductSuccess = ModalAddProductSuccess;
LayoutModalBoxs.LoadingAnimation = LoadingAnimation;
