import { retriveDataFunFact } from "@/lib/firebase/services";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    const getDataFunFact = await retriveDataFunFact("funFactSugar")
    return NextResponse.json({statusbar: 200, message: "berhasil", data:getDataFunFact })
}