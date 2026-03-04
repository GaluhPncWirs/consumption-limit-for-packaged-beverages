import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { resultCalculate } = await req.json();

  if (resultCalculate) {
    const token = jwt.sign(
      {
        result: resultCalculate,
      },
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "1h" },
    );

    const response = NextResponse.json({
      status: "success",
      message: "Result calculated successfully",
    });

    response.cookies.set("resultCalculate", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return response;
  }
}
