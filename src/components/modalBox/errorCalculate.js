export default function ModalErrorCalculate({ setModalError }) {
  return (
    <div className="w-1/3 bg-green-400 z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col justify-center items-center gap-3 max-[640px]:w-3/5 sm:w-3/5 md:w-2/5 lg:w-1/3 pt-5">
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
      <h1 className="font-bold text-xl">Perhitungan Error</h1>
      <p className="font-medium">Hasilnya Tidak Diperbolehkan Kurang Dari 1</p>
      <p className="font-medium mb-2">Silahkan Input Kembali !</p>
      <div className="bg-green-500 rounded-b-lg flex justify-evenly w-full items-center py-2 hover:bg-green-600">
        <button
          className="font-semibold text-xl cursor-pointer basis-full"
          onClick={() => setModalError(false)}
        >
          Oke
        </button>
      </div>
    </div>
  );
}
