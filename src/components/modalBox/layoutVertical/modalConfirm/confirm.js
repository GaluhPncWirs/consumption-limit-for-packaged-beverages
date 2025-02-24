import IconWarning from "@/components/warningIcon/icon";
import LayoutModalVertical from "../modalVer";

export default function ConfirmAddProduct() {
  return (
    <LayoutModalVertical>
      <div className="flex flex-col justify-center items-center h-full gap-y-4">
        <IconWarning />
        <div>
          <h1 className="text-xl text-center font-semibold">
            Apakah Anda Yakin ?
          </h1>
          <ul className="mt-2">
            <li>Nama Produk : Adem Sari Sparkling</li>
            <li>Kandungan Gula Minuman : 35</li>
            <li>Takaran Saji Per Kemasan : 1</li>
            <li>Volume Kemasan (ml) : 320</li>
          </ul>
        </div>
        <div className="bg-green-400 rounded-b-xl flex justify-around items-center w-full py-1">
          <button className="hover:bg-green-600 text-lg font-semibold w-1/3 rounded-lg">
            Ya
          </button>
          <button className="hover:bg-green-600 text-lg font-semibold w-1/3 rounded-lg">
            Tidak
          </button>
        </div>
      </div>
    </LayoutModalVertical>
  );
}
