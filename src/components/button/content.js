import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocationPage } from "@/store/usePathname/state";
import { useDeleteToken } from "@/store/useDeleteToken/state";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function ButtonBack() {
  const { push } = useRouter();
  const curentLocation = useLocationPage((state) => state.curentLocationPage);
  const [deleteTokenBtn, setDeleteTokenBtn] = useState(false);
  const { setDeleteToken, isDeleteToken } = useDeleteToken(
    useShallow((state) => ({
      setDeleteToken: state.setDeleteToken,
      isDeleteToken: state.isDeleteSuccess,
    })),
  );

  useEffect(() => {
    setDeleteToken(deleteTokenBtn);
    if (isDeleteToken) {
      toast("✅ Berhasil", {
        description: "Kembali ke Perhitungan Kalori",
      });
      push("/calculateCalories");
    }
  }, [deleteTokenBtn, setDeleteToken, isDeleteToken, push]);

  return (
    <>
      {curentLocation === "/mainContent/addProduct" ||
      curentLocation === "/mainContent/about" ? (
        <button
          className="py-2 px-5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-x-2 cursor-pointer"
          onClick={() => push("/mainContent/calculate")}
        >
          <span>Kembali</span>
          <ArrowLeft />
        </button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <button className="py-2 px-5 hover:bg-yellow-400 bg-yellow-300 rounded-xl flex flex-row-reverse justify-center items-center gap-x-2 cursor-pointer">
              <span>Kembali</span>
              <ArrowLeft />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Keluar</DialogTitle>
              <DialogDescription>
                Apakah kamu ingin kembali ke halaman awal ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button
                onClick={() => setDeleteTokenBtn(true)}
                className="bg-[#54C392] hover:bg-green-500 text-black"
              >
                Oke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
