import LayoutModalVertical from "../modalVer";
import ButtonModalBoxs from "../../../button/btnModal";
import IconWarning from "../../../warningIcon/icon";

export default function AddProductError({ setModalOnclick }) {
  return (
    <LayoutModalVertical>
      <div className="h-full flex flex-col gap-y-5 pt-3 justify-center">
        <IconWarning />
        <div className="text-center mx-7 my-1 max-[640px]:mx-5">
          <h1 className="font-bold text-xl">Produk Tidak Bisa Ditambahkan</h1>
          <p className="font-medium mt-3">
            Input Tidak Boleh Kosong dan Tidak Boleh Hanya Berisi Angka!
          </p>
        </div>
        <ButtonModalBoxs setModalOnclick={setModalOnclick} />
      </div>
    </LayoutModalVertical>
  );
}
