import { Quicksand } from "next/font/google";
import "./global.css";

const quicksand = Quicksand({ subsets: ["latin"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <div className="background_template">{children}</div>
      </body>
    </html>
  );
}
