import { initializeApp } from "firebase-admin"
import { cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"


const seviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if(!getApps().length){
    initializeApp({
        credential: cert(seviceAccount),
    })
}

const database = getFirestore()

export {database}