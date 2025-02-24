import LayoutModalHorizontal from "../modalHor";

export default function FindProductError({ setModalBoxErr }) {
  return (
    <LayoutModalHorizontal
      modalTitle={"Input Harus Sesuai"}
      description={"Tolong Untuk Cari Yang Telah Disediakan"}
    >
      <div className="h-1/4 bg-green-400 rounded-b-xl flex justify-center items-center hover:bg-green-600">
        <button
          className="text-xl font-semibold w-full"
          onClick={() => setModalBoxErr(false)}
        >
          Oke
        </button>
      </div>
    </LayoutModalHorizontal>
  );
}
