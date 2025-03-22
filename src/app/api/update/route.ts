import { updateAllDocument } from "@/lib/firebase/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const result = await updateAllDocument("nutritionFact")
    if(!result.success){
        return NextResponse.json({ status: 500, message: result.message });
    }
    return NextResponse.json({ status: 200, message: result.message });
}