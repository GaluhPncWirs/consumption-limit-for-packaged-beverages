import LayoutModalVertical from "../modalVer";
import ButtonModalBoxs from "../../../button/btnModal";
import IconWarning from "../../../warningIcon/icon";

export default function AddProductError({ setModalOnclick, errors }) {
  return (
    <LayoutModalVertical>
      <div className="h-full flex flex-col gap-y-5 pt-3 justify-center">
        <IconWarning />
        <div className="text-center mx-7 my-1 max-[640px]:mx-5">
          <h1 className="font-bold text-xl">Produk Tidak Bisa Ditambahkan</h1>
          <p className="font-medium mt-3">
            {errors.isNameTooLong === true ? (
              <span>Input Nama produk tidak boleh lebih dari 50 karakter</span>
            ) : errors.isSugarTooLong === true ? (
              <span>Input Kandungan gula tidak boleh lebih dari 2 digit</span>
            ) : errors.isServingSizeTooLong === true ? (
              <span>Takaran saji tidak boleh lebih dari 2 digit</span>
            ) : errors.isVolumeTooLong === true ? (
              <span>Input Volume tidak boleh lebih dari 3 digit</span>
            ) : (
              <span>
                Input Nama Produk Tidak Boleh Kosong dan Tidak Boleh Hanya
                Berisi Angka!
              </span>
            )}
          </p>
        </div>
        <ButtonModalBoxs setModalOnclick={setModalOnclick} />
      </div>
    </LayoutModalVertical>
  );
}
