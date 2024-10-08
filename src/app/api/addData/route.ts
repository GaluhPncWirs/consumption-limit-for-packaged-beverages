import { addData } from "@/lib/firebase/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const req = await request.json()
    const response = await addData(req, "nutritionFact")
    return NextResponse.json({status: response.status, message:response.message})
}