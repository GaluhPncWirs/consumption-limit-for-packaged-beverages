import app from "./init"
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query, where, writeBatch } from "firebase/firestore"

const firestore = getFirestore(app)

export async function retriveDataIng(collectionName:string) {
    const snapshot = await getDocs(collection(firestore, collectionName))
    const ING = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    return ING
}

export async function addData(dataProduct : {nameProduct:string, sugars:number, volume:number, type:string} ,collectionName:string) {
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
            const newDocs = await addDoc(collection(firestore, collectionName), dataProduct)
            return {status: true, message:"product berhasil di tambahkan", id: newDocs.id}
        }catch(error){
            return {status: false, message:"terdapat kesalahan"}
        }
    }
}


export async function retriveDataFunFact(collectionName:string){
    const snapshot = await getDocs(collection(firestore, collectionName))
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    return data
}

export async function retriveDataSugarReleatedJournal(collectionName:string){
    const snapshot = await getDocs(collection(firestore, collectionName))
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    return data
}


export async function retriveDataVideoEducations(collectionName:string) {
    const snapshot = await getDocs(collection(firestore, collectionName))
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))

    return data
}


// // add field in firebase
// export async function updateAllDocument (name:string, field:string) {
//     try{
//         const batch = writeBatch(firestore)
//         const querySnapshot = await getDocs(collection(firestore, name))

//         querySnapshot.forEach((doc) => {
//             const docRef = doc.ref
//             batch.update(docRef, {type: field})
//         })

//         await batch.commit()
//         return { success: true, message: "Semua dokumen berhasil diperbarui!" };
//     }catch(error:any){
//         return { success: false, message: error.message };
//     }
// }