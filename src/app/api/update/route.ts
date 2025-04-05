import { updateAllDocument } from "@/lib/firebase/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const result = await updateAllDocument("videoEducations", "Youtube")
    if(!result.success){
        return NextResponse.json({ status: 500, message: result.message });
    }
    return NextResponse.json({ status: 200, message: result.message });
}