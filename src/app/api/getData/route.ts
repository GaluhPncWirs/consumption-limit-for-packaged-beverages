import { retriveData } from "@/lib/firebase/services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(resuest: NextRequest){
    const nutritionFact = await retriveData("nutritionFact")
    return NextResponse.json({statusbar: 200, message:"success", data : nutritionFact})
}

