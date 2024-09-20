import { Quicksand } from "next/font/google";
import "./index.css";
import { CaloriesProvider } from "@/context/useContex";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <CaloriesProvider>{children}</CaloriesProvider>
      </body>
    </html>
  );
}
