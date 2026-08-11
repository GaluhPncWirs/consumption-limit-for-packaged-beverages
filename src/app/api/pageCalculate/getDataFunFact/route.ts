import { getDataFunFactData } from "@/services/firebase/dataFunFacts/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getDataFunFactData();

    if (!result.status) {
      return NextResponse.json({
        status: false,
        message: "Data funfact gagal diambil",
        data: [],
      });
    }

    return NextResponse.json({
      status: result.status,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Error terdapat kesalahan dalam fetching data",
    });
  }
}
