import { retriveDataSugarReleatedJournal } from "@/lib/firebase/services";
import { NextResponse } from "next/server";


export async function GET() {
    const getDataJournals = await retriveDataSugarReleatedJournal("sugarRelatedJournals")
    return NextResponse.json({statusbar : 200, message: "berhasil", data : getDataJournals})
}