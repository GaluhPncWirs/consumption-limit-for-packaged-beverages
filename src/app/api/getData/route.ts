import { retriveDataIng } from "@/lib/firebase/services";
import { NextResponse } from "next/server";


export async function GET(){
    const nutritionFact = await retriveDataIng("nutritionFact")
    return NextResponse.json({statusbar: 200, message:"success", data : nutritionFact}, {
        headers: {
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store',
            'Vercel-CDN-Cache-Control': 'no-store',
            "Vercel-Cache-Control": 'no-store'
        }
    })
}