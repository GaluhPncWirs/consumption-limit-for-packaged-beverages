"use client";
import MainContentLayout from "@/layout/mainSystem/content";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AboutProject() {
  const pathname = usePathname();

  return (
    <MainContentLayout path={pathname}>
      <div className="flex gap-y-8 flex-col my-10">
        <div className="bg-[#f9fff9] rounded-xl shadow-lg shadow-slate-700 flex flex-col items-center p-7 justify-center gap-5 sm:flex-row">
          <div className="flex flex-col items-center basis-1/2">
            <Image
              src="/images/pageAbout/userProfile.png"
              alt="profile"
              width={500}
              height={500}
              className="size-44"
              loading="eager"
            />
            <div className="font-semibold">
              <h1 className="text-2xl mb-1">Galuh Panca Wirasa</h1>
              <h2 className="text-xl">Nim. 2103015175</h2>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-5 basis-1/2">
            <Image
              src="/images/pageAbout/logo_uhamka_FTII.png"
              alt="logo UHAMKA"
              width={500}
              height={500}
              className="w-48"
              loading="eager"
            />
            <h1 className="font-semibold text-xl text-center">
              Mahasiswa Teknik Informatika Universitas Prof.Dr. Hamka
            </h1>
          </div>
        </div>
        <div className="bg-[#f9fff9] rounded-xl p-7 shadow-lg shadow-slate-800">
          <h1 className="text-3xl font-bold mb-4">Tentang Project</h1>
          <div className="text-justify font-medium text-lg flex flex-col gap-2">
            <p>
              Saya membuat website ini untuk menyelesaikan studi perkuliahan ini
              dengan judul skripsi yang saya kerjakan yaitu{" "}
              <span className="font-semibold">
                “Sistem Informasi Perhitungan Batas Gula Harian Dalam
                Mengkonsumsi Minuman Kemasan Berbasis Web Dengan Menggunakan
                Metode Prototype”
              </span>
              .
            </p>
            <p>
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
            <p>
              Semoga website ini dapat memberikan manfaat bagi masyarakat yang
              ingin mengontrol asupan gula dengan lebih baik dan menjalani pola
              hidup yang lebih sehat.
            </p>
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
}
