import { getDataRegister } from "@/services/firebase/dataProducts/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const keyword = await req.json();
  try {
    const result = await getDataRegister(keyword);

    if (!result.status) {
      return NextResponse.json({
        status: false,
        message: "Data minuman gagal diambil",
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
