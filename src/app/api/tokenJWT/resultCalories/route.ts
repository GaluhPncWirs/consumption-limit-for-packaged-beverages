import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { resultCalculate } = await req.json();

  if (resultCalculate) {
    const token = jwt.sign(
      {
        result: resultCalculate,
      },
      process.env.JWT_SECRET_KEY || "mySecretKey",
      { expiresIn: "1h" },
    );

    const response = NextResponse.json({
      statusCode: 200,
      status: "success",
      message: "Hasil perhitungan berhasil dilakukan",
    });

    response.cookies.set("resultCalculate", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    response.cookies.set("calculationSuccess", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.json({
    statusCode: 400,
    status: "error",
    message: "Gagal menghitung hasil",
  });
}
