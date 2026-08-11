import { Quicksand } from "next/font/google";
import "./global.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";

const quicksand = Quicksand({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  icons: "/images/Nutrigood.ico",
  authors: [
    {
      name: "Galuh Panca Wirasa",
      url: "https://penghitung-bataskonsumsi-minumankemasan.vercel.app/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={quicksand.className}>
        <main className="relative min-h-screen">
          {/* Background */}
          <Image
            src="/images/global/background-beverage.jpg"
            alt=""
            fill
            priority
            className="fixed inset-0 -z-10 object-cover opacity-70"
            sizes="100vw"
          />

          {/* Content */}
          <div className="relative z-10">{children}</div>
          <Toaster richColors />
        </main>
      </body>
    </html>
  );
}
