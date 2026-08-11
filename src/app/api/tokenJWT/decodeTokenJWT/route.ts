import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(req: NextRequest) {
  const tokenJWTFromCokies = req.cookies.get("resultCalculate")?.value;
  if (!tokenJWTFromCokies) {
    return NextResponse.json({
      status: false,
      message: "Token Tidak Ditemukan",
    });
  }
  try {
    const resultDecodeJWT = jwtDecode(tokenJWTFromCokies);
    return NextResponse.json({
      status: true,
      message: "Berhasil Decode Token",
      data: resultDecodeJWT,
      expired: resultDecodeJWT.exp,
    });
  } catch (err) {
    NextResponse.json({
      status: false,
      message: "Token Gagal Di Decode",
    });
  }
}
