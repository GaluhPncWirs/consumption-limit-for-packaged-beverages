import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const request = await req.json();

  if (request.validCaculations) {
    const response = NextResponse.json({
      statusCode: 200,
      status: true,
      message: "Perhitungan berhasil",
    });
    response.cookies.set("formFilledSuccess", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json({
    statusCode: 401,
    status: false,
    message: "Perhitungan gagal",
  });
}
