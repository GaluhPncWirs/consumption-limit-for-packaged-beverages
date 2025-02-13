export default function ErrorInput({ setModal }) {
  return (
    <div className="bg-green-500 w-1/3 rounded-xl absolute top-1/2 left-1/2 h-1/3 z-30 -translate-x-1/2 -translate-y-1/2 max-[640px]:w-9/12 sm:w-3/5 md:w-1/2 lg:w-1/3">
      <div className="h-full max-[640px]:px-3 sm:px-4 md:px-5 lg:px-8">
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
          <div className="bg-green-400 rounded-b-xl h-1/5 flex justify-center items-center hover:bg-green-600">
            <button
              className="text-xl font-semibold w-full"
              onClick={() => setModal(false)}
            >
              Oke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
