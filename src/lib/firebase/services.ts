import app from "./init"
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore"

const firestore = getFirestore(app)

export async function retriveData(collectionName:string) {
    const snapshot = await getDocs(collection(firestore, collectionName))
    const ING = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    return ING
}

export async function addData(dataProduct : {nameProduct:string, sugars:number, volume:number} ,collectionName:string) {
    const dataQuery = query(collection(firestore, collectionName), where("nameProduct", "==", dataProduct.nameProduct))
    const snapshot = await getDocs(dataQuery)
    const data = snapshot.docs.map((doc) => ({
        id:doc.id,
        ...doc.data()
    }))

    if(data.length > 0){
        return {status:false, message:"data sudah ada"}
    }else{
        try{
            await addDoc(collection(firestore, collectionName), dataProduct)
            return {status: true, message:"product berhasil di tambahkan"}
        }catch(error){
            return {status: false, message:"terdapat kesalahan"}
        }
    }
}