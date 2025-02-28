import IconWarning from "@/components/warningIcon/icon";
import LayoutModalVertical from "../modalVer";

export default function ConfirmAddProduct({
  setIsConfirm,
  onConfirm,
  setModalSuccess,
  mustFilled,
}) {
  const handleConfirm = () => {
    setIsConfirm(true);
    onConfirm();
    setModalSuccess(false);
  };

  return (
    <LayoutModalVertical>
      <div className="flex flex-col justify-center items-center h-full gap-y-4 pt-3">
        <IconWarning />
        <div className="w-full">
          <h1 className="text-xl text-center font-semibold">
            Apakah Anda Yakin ?
          </h1>
          <ul className="mt-2 flex flex-col justify-center items-center">
            <li>
              Nama Produk :{" "}
              <span className="font-semibold">{mustFilled.nameProduct}</span>
            </li>
            <li>
              Kandungan Gula Minuman :{" "}
              <span className="font-semibold">{mustFilled.kandunganGula}</span>
            </li>
            <li>
              Takaran Saji Per Kemasan :{" "}
              <span className="font-semibold">{mustFilled.takaranSaji}</span>
            </li>
            <li>
              Volume Kemasan (ml) :{" "}
              <span className="font-semibold">{mustFilled.volume}</span>
            </li>
          </ul>
        </div>
        <div className="bg-green-400 rounded-b-xl flex justify-around items-center w-full h-full">
          <button
            className="hover:bg-green-600 text-lg font-semibold w-1/3 rounded-lg"
            onClick={handleConfirm}
          >
            Ya
          </button>
          <button
            className="hover:bg-green-600 text-lg font-semibold w-1/3 rounded-lg"
            onClick={() => setModalSuccess(false)}
          >
            Tidak
          </button>
        </div>
      </div>
    </LayoutModalVertical>
  );
}
