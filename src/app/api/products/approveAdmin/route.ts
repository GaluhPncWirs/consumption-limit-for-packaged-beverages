// import { database } from "@/lib/firebase/firebaseAdmin"
// import { pendingAddData } from "@/lib/firebase/services";
// import { collection, query } from "firebase/firestore";
// import { revalidatePath } from "next/cache";
// import { NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//     const body = await request.json()
//     const pendingId = body.nameProduct
//     const tes = await pendingAddData(pendingId)

//     await revalidatePath("/admin/dashboard");
    
//     return NextResponse.json({status: 200, message:"berhasil", data:tes.id})
// }