"use client";

import NavigasiBar from "@/components/navbar/navigasiBar";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AboutProject() {
  const path = usePathname();
  return (
    <div className="max-[640px]:h-full sm:h-full lg:h-screen">
      <NavigasiBar path={path} props={""} />
      <div className="flex pt-20 pb-5 gap-5 mx-5 h-full max-[640px]:flex-col sm:flex-col md:flex-row lg:flex-row">
        <div className="bg-green-400 rounded-xl px-5 py-10 md:basis-1/3 lg:basis-1/4">
          <div className="flex justify-evenly h-full items-center flex-col gap-5">
            <div className="sm:flex sm:justify-center sm:items-center sm:w-11/12 sm:gap-5 max-[640px]:flex max-[640px]:justify-center max-[640px]:items-center max-[640px]:gap-5 max-[640px]:w-full md:flex-col">
              <Image
                src={"/images/userProfile.png"}
                alt="profile"
                width={50}
                height={50}
                className="w-4/6 bg-cover bg-center max-[640px]:w-2/5 sm:w-2/6 md:w-2/3 lg:w-1/2"
              />
              <div className="text-center">
                <h1 className="font-bold text-2xl max-[640px]:mb-2 sm:mb-3">
                  Galuh Panca Wirasa
                </h1>
                <h2 className="font-semibold text-xl">Nim. 2103015175</h2>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-5 max-[640px]:max-w-sm">
              <Image
                src={"/images/logo_uhamka_FTII.png"}
                alt="logo UHAMKA"
                width={50}
                height={50}
                className="w-2/5 bg-cover bg-center"
              />
              <h3 className="font-semibold text-lg text-center sm:text-xl">
                Mahasiswa Teknik Informatika Universitas Prof.Dr. Hamka
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-green-300 rounded-xl p-8 md:basis-2/3 lg:basis-9/12">
          <h1 className="text-2xl font-bold text-center mb-5">
            Tentang Project
          </h1>
          <div className="text-justify font-medium text-lg flex flex-col gap-5">
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
