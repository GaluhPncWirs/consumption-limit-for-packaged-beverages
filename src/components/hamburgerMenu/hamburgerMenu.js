import { useState } from "react";
import PathNavbar from "../navbar/pathNavbar";

export default function HamburgerMenu({ props, path }) {
  const [isCheked, setIsCheked] = useState(false);
  return (
    <div className="flex h-full items-center justify-center sm:hidden">
      <ul
        className={`flex w-2/5 justify-between max-[640px]:absolute max-[640px]:flex max-[640px]:top-0 max-[640px]:right-0 max-[640px]:justify-evenly max-[640px]:h-screen max-[640px]:flex-col max-[640px]:items-center max-[640px]:w-1/2 max-[640px]:bg-green-400 max-[640px]:-z-10 max-[640px]:transition-all max-[640px]:duration-300 max-[640px]:text-xl max-[640px]:font-semibold
      ${
        isCheked === true
          ? `max-[640px]:translate-x-0`
          : `max-[640px]:translate-x-full`
      }`}
      >
        <PathNavbar props={props} path={path} />
      </ul>
      <div className="menu flex flex-col h-5 justify-between">
        <input
          type="checkbox"
          checked={isCheked}
          onChange={() => setIsCheked(!isCheked)}
          className="size-5 absolute z-20 cursor-pointer opacity-0"
        />
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
        <span className="block w-5 h-1 bg-black rounded-md transition-all"></span>
      </div>
    </div>
  );
}
