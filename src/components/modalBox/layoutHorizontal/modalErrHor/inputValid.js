import LayoutModalHorizontal from "../modalHor";

export default function InputValidationError({ setInputValid }) {
  return (
    <LayoutModalHorizontal
      modalTitle={"Input Tidak Valid"}
      description={"Silakan masukkan kembali dengan benar !"}
    >
      <div className="h-1/4 bg-green-400 rounded-b-xl flex justify-center items-center hover:bg-green-600">
        <button
          className="text-xl font-semibold w-full"
          onClick={() => setInputValid(false)}
        >
          Oke
        </button>
      </div>
    </LayoutModalHorizontal>
  );
}
