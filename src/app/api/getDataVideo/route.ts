import { retriveDataVideoEducations } from "@/lib/firebase/services";
import { NextResponse } from "next/server";


export async function GET() {
    const getDataVideo = await retriveDataVideoEducations("videoEducations")
    return NextResponse.json({statusbar: 200, message:"berhasil", data : getDataVideo})
}