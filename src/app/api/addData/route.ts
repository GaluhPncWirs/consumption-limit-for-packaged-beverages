import { addData } from "@/lib/firebase/services";
import { addDataBeverage } from "@/services/firebase/dataProducts/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const response = await addDataBeverage(payload);

    if (!response) {
      return NextResponse.json({
        status: false,
        message: "Data minuman tidak belum ada",
      });
    }
    return NextResponse.json({
      status: response.status,
      message: response.message,
    });
  } catch (err) {
    NextResponse.json({
      status: false,
      message: "Error fetch API",
    });
  }
}
