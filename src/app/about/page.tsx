"use client";

import NavigasiBar from "@/components/navbar/navigasiBar";
import { usePathname } from "next/navigation";

export default function AboutProject() {
  const path = usePathname();
  return (
    <div>
      <NavigasiBar path={path} props={""} />
      <div>
        <h1>this is my project</h1>
      </div>
    </div>
  );
}
