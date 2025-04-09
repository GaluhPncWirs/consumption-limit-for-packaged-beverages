import { retriveDataIng } from "@/lib/firebase/services";
import { NextResponse } from "next/server";


export async function GET(){
    const nutritionFact = await retriveDataIng("nutritionFact")
    return NextResponse.json({statusbar: 200, message:"success", data : nutritionFact})
}

