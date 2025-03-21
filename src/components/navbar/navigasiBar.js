import Image from "next/image";
import PathNavbar from "../navbar/pathNavbar";
import HamburgerMenu from "../hamburgerMenu/hamburgerMenu";
import { useEffect, useRef } from "react";

export default function NavigasiBar({ props, path }) {
  return (
    <div className="w-full h-16 bg-green-400 fixed top-0 z-50">
      <div className="flex h-full">
        <div className="basis-1/5 bg-green-300 rounded-r-lg flex justify-center items-center max-[640px]:basis-full max-[640px]:justify-start max-[640px]:px-5 sm:basis-1/4">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-3/5 bg-cover bg-center max-[640px]:w-1/3 sm:w-5/6 md:w-3/5 lg:w-1/2"
          />
        </div>
        <div className="max-[640px]:basis-1/6 basis-9/12">
          <ul className="flex justify-around items-center h-full font-bold max-[640px]:hidden sm:text-base md:text-lg lg:text-xl">
            <PathNavbar props={props} path={path} />
          </ul>
          <HamburgerMenu props={props} path={path} />
        </div>
      </div>
    </div>
  );
}
