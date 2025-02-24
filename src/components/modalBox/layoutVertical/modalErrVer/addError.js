import LayoutModalVertical from "../modalVer";
import ButtonModalBoxs from "../../../button/btnModal";

export default function AddProductError({ setModalOnclick }) {
  return (
    <LayoutModalVertical>
      <div className="h-full flex flex-col gap-3 py-4 justify-center">
        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-300">
          <svg
            className="size-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div className="text-center">
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
