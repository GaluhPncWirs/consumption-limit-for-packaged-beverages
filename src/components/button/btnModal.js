export default function ButtonModalBoxs({ setModalOnclick }) {
  return (
    <div className="bg-green-400 rounded-b-xl h-full flex justify-center items-center hover:bg-green-600">
      <button
        className="text-xl font-semibold w-full"
        onClick={() => setModalOnclick(false)}
      >
        Oke
      </button>
    </div>
  );
}
