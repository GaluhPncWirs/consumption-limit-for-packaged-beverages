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
import { useDeleteToken } from "@/store/useDeleteToken/state";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function ButtonBack() {
  const { push } = useRouter();
  // const curentLocation = useLocationPage((state) => state.curentLocationPage);
  const { setDeleteToken, isDeleteToken } = useDeleteToken(
    useShallow((state) => ({
      setDeleteToken: state.setDeleteToken,
      isDeleteToken: state.isDeleteSuccess,
    })),
  );

  useEffect(() => {
    if (isDeleteToken) {
      toast("✅ Berhasil", {
        description: "Kembali ke Perhitungan Kalori",
      });
      push("/calculateCalories");
    }
  }, [isDeleteToken, push]);

  return (
    <>
      {/* {curentLocation === "/mainContent/addProduct" ||
      curentLocation === "/mainContent/about" ? (
        <Button
          variant="outline"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="size-6" />
          <span>Kembali</span>
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="size-6" />
              <span>Kembali</span>
            </Button>
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
                onClick={() => setDeleteToken(true)}
                className="bg-[#54C392] hover:bg-green-500 text-black"
              >
                Oke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-6" />
            <span>Kembali</span>
          </Button>
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
              onClick={() => setDeleteToken(true)}
              className="bg-[#54C392] hover:bg-green-500 text-black"
            >
              Oke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
