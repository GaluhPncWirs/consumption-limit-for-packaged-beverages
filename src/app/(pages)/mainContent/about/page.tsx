"use client";
import MainContentLayout from "@/layout/mainSystem/content";
import { Info, Quote } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AboutProject() {
  const pathname = usePathname();

  return (
    <MainContentLayout path={pathname}>
      <div className="bg-[#f9fff9] mx-auto w-full p-6 rounded-xl max-w-6xl space-y-6">
        {/* ================================================== */}
        {/* PAGE HEADER                                        */}
        {/* ================================================== */}

        <header className="px-1">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tentang Nutrigood
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Mengenal pembuat dan tujuan dari website untuk membantu pengguna
            memahami konsumsi gula harian.
          </p>
        </header>

        {/* ================================================== */}
        {/* PROFILE + PROJECT INTRO                            */}
        {/* ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
            {/* PROFILE */}
            <div className="border-b border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-50 shadow-md sm:size-32">
                  <Image
                    src="/images/pageAbout/userProfile.png"
                    alt="Profile"
                    width={500}
                    height={500}
                    className="size-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Identity */}
                <div className="mt-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Galuh Panca Wirasa
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">NIM. 2103015175</p>
                </div>

                {/* Role */}
                <div className="mt-4 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5">
                  <span className="text-xs font-semibold text-emerald-700">
                    Mahasiswa Teknik Informatika Universitas Prof.Dr. Hamka
                  </span>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-slate-200" />

                {/* Project Logo */}
                <Image
                  src="/images/global/logo.png"
                  alt="Logo Project"
                  width={500}
                  height={500}
                  className="w-36 object-contain sm:w-40"
                />

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Website project untuk mendukung edukasi mengenai konsumsi gula
                  harian.
                </p>
              </div>
            </div>

            {/* PROJECT INTRO */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="max-w-2xl">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    Tentang Project
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Sistem Informasi Perhitungan Batas Gula Harian Dalam
                    Mengkonsumsi Minuman Kemasan Berbasis Web Dengan Menggunakan
                    Metode Prototype
                  </h2>
                </div>

                <div className="space-y-4 text-sm leading-7 text-slate-600">
                  <p className="text-justify">
                    Website ini dikembangkan sebagai bagian dari penyelesaian
                    studi perkuliahan dengan fokus pada sistem perhitungan
                    konsumsi gula harian dalam mengkonsumsi minuman kemasan.
                  </p>

                  <p className="text-justify">
                    Sistem dirancang untuk membantu pengguna mengetahui
                    kebutuhan kalori serta batas maksimal konsumsi gula
                    berdasarkan profil individu. Informasi tersebut kemudian
                    digunakan sebagai dasar untuk membantu pengguna memahami
                    jumlah gula yang dikonsumsi melalui minuman.
                  </p>

                  <p className="text-justify">
                    Selain perhitungan, website ini menyediakan informasi
                    edukatif mengenai dampak konsumsi gula berlebih dan membantu
                    pengguna lebih sadar dalam memilih minuman yang mereka
                    konsumsi sehari-hari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* PROJECT DESCRIPTION                                */}
        {/* ================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Info className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Tujuan Project
                </h2>

                <p className="text-xs text-slate-500">
                  Mengapa website ini dibuat?
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Website ini diharapkan dapat membantu masyarakat menjadi lebih
              sadar terhadap jumlah gula yang dikonsumsi setiap hari. Dengan
              informasi yang lebih mudah dipahami, pengguna dapat
              mempertimbangkan pilihan minuman yang dikonsumsi dan membangun
              kebiasaan yang lebih baik dalam mengontrol asupan gula.
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <Quote className="size-5 text-emerald-500 fill-emerald-500 mb-4" />
              <p className="text-sm font-medium leading-6 text-emerald-800">
                Tujuan utama project ini bukan hanya memberikan angka, tetapi
                membantu pengguna memahami apa arti angka tersebut terhadap
                kebiasaan konsumsi gula sehari-hari.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainContentLayout>
  );
}
