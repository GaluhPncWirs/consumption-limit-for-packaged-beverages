import Image from "next/image";

export default function Notfound() {
  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center flex-col">
        <Image
          src="/images/not_found.png"
          alt="notfound"
          width={50}
          height={50}
          className="w-1/2"
        />
      </div>
      <h1 className="text-[#6C63FF] font-semibold text-2xl">
        Halaman Tidak Ditemukan
      </h1>
    </div>
  );
}
