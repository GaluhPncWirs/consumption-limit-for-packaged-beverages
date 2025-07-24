import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const param = request.nextUrl.searchParams
    const tag = param.get("tag")
    const secret = param.get("secret")

    if(!tag){
        return NextResponse.json({status:400, message:"missing tag params"})
    }

    if(secret !== process.env.SECRET_KEY){
        return NextResponse.json({status:400, message:"worng secret id"})
    }

    revalidateTag(tag)
    return NextResponse.json({revalidate : true, date: Date.now(), message : "Data Telah Berhasil Masuk Kedalam Database"})
}