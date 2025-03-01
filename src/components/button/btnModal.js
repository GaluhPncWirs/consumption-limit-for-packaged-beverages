export default function ButtonModalBoxs({ setModalOnclick }) {
  return (
    <div className="bg-green-400 rounded-b-xl h-full flex justify-center items-center hover:bg-green-600 max-[640px]:py-2 sm:py-2 md:py-3">
      <button
        className="text-xl font-semibold w-full"
        onClick={() => setModalOnclick(false)}
      >
        Oke
      </button>
    </div>
  );
}
