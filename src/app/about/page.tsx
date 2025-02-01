"use client";

import NavigasiBar from "@/components/navbar/navigasiBar";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AboutProject() {
  const path = usePathname();
  return (
    <div className="h-screen">
      <NavigasiBar path={path} props={""} />
      <div className="flex pt-20 pb-5 gap-5 mx-5 h-full">
        <div className="basis-1/4 bg-green-400 rounded-xl px-5 py-10">
          <div className="flex justify-evenly h-full items-center flex-col gap-5">
            <Image
              src={"/images/userProfile.png"}
              alt="profile"
              width={50}
              height={50}
              className="w-4/6 bg-cover bg-center"
            />
            <h1 className="font-bold text-2xl">Galuh Panca Wirasa</h1>
            <h2 className="font-semibold text-xl">Nim. 2103015175</h2>
            <div className="flex flex-col justify-center items-center gap-5">
              <Image
                src={"/images/logo_uhamka_FTII.png"}
                alt="logo UHAMKA"
                width={50}
                height={50}
                className="w-2/5 bg-cover bg-center"
              />
              <h3 className="font-semibold text-lg text-center">
                Mahasiswa Teknik Informatika Universitas Prof.Dr. Hamka
              </h3>
            </div>
          </div>
        </div>
        <div className="basis-9/12 bg-green-300 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-5">
            Tentang Project
          </h1>
          <div className="text-justify font-medium text-lg">
            <p className="indent-7">
              Saya membuat website ini untuk menyelesaikan studi perkuliahan ini
              dengan judul skripsi yang saya kerjakan yaitu{" "}
              <span className="font-semibold">
                “Sistem Informasi Perhitungan Batas Gula Harian Dalam
                Mengkonsumsi Minuman Kemasan Berbasis Web Dengan Menggunakan
                Metode Prototype”
              </span>
              .
            </p>
            <br />
            <p className="indent-7">
              Website ini dirancang untuk membantu pengguna dalam menghitung
              batas konsumsi gula harian berdasarkan profil individu mereka.
              Melalui sistem ini, pengguna dapat mengetahui nilai kalori dan
              jumlah maksimal konsumsi gula perhari, Selain itu, website ini
              juga Dapat memberikan rekomendasi, edukasi mengenai dampak
              konsumsi gula berlebih, serta informasi mengenai tingkat resiko
              kesehatan. Dengan adanya fitur ini, diharapkan pengguna dapat
              lebih sadar akan jumlah gula yang mereka konsumsi setiap hari dan
              dapat mengambil langkah yang lebih bijak dalam memilih minuman
              yang mereka konsumsi.
            </p>
            <br />
            <p className="indent-7">
              Semoga website ini dapat memberikan manfaat bagi masyarakat yang
              ingin mengontrol asupan gula dengan lebih baik dan menjalani pola
              hidup yang lebih sehat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
