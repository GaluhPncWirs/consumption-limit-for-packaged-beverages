import { Quicksand } from "next/font/google";
import "./global.css";
import { Metadata } from "next";

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
        <div className="background_template">{children}</div>
      </body>
    </html>
  );
}
