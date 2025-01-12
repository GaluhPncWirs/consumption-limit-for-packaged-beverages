import { Quicksand } from "next/font/google";
import "./index.css";

const quicksand = Quicksand({ subsets: ["latin"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-orange-300">
      <body className={quicksand.className}>{children}</body>
    </html>
  );
}
