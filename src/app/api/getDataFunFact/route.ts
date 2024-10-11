import { retriveDataFunFact } from "@/lib/firebase/services";
import { NextResponse } from "next/server";


export async function GET() {
    const getDataFunFact = await retriveDataFunFact("funFactSugar")
    return NextResponse.json({status : true, message: "berhasil", data:getDataFunFact })
}