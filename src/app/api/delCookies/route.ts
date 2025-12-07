import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookiesStore = await cookies();
  cookiesStore.delete("formFilledSuccess");
  return NextResponse.json({
    status: true,
    message: "Cookies berhasil dihapus",
  });
}
