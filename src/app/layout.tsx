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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/images/Nutrigood.ico" />
      </head>
      <body className={quicksand.className}>
        <div className="background_template">{children}</div>
      </body>
    </html>
  );
}
