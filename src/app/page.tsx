"use client";
import { usePathname } from "next/navigation";
import DisplayInputUser from "./inputUser/page";
import MainContent from "./mainContent/page";

export default function RootLayout() {
  const pathName = usePathname();
  return (
    <>{pathName === "/mainContent" ? <MainContent /> : <DisplayInputUser />}</>
  );
}
