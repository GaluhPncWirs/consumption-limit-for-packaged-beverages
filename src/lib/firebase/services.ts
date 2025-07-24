import { educationsForArtikel, educationsForFunfactSugar, educationsForVideo, productBeverageTypes } from "@/types/dataTypes"
import { app } from "./init";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, where} from "firebase/firestore"

const firestore = getFirestore(app)

export function subscribeToProducts(
    callback: (products: productBeverageTypes[]) => void
  ) {
    const q = query(collection(firestore, "nutritionFact"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataProductsBeverage = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as productBeverageTypes[];
      callback(dataProductsBeverage);
    });
  
    return unsubscribe;
  }


  export function subscribeToPendingProducts(
    callback: (products: productBeverageTypes[]) => void
  ) {
    const q = query(collection(firestore, "nutritionFact_pending"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataProductsBeverage = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as productBeverageTypes[];
      callback(dataProductsBeverage);
    });
  
    return unsubscribe;
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

export async function pendingDeleteData(nameProduct:string) {
    try{
        const dataQuery = query(collection(firestore, "nutritionFact_pending"), where("nameProduct", "==", nameProduct))
    const snapshot = await getDocs(dataQuery)
    if(snapshot.empty){
        return { status: false, message: "Data tidak ditemukan" };
    }

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(firestore, "nutritionFact_pending", docSnap.id));
    }

    return { status: true, message: "Product berhasil dihapus" };
    }catch{
    return { status: false, message: "Terjadi kesalahan saat menghapus data" };
    }
    // const data = snapshot.docs.map((doc) => ({
    //     id:doc.id,
    //     ...doc.data()
    // }))

    // if(data.length > 0){
    //     return {status:false, message:"data sudah ada"}
    // }else{
    //     try{
    //         const newDocs = await addDoc(collection(firestore, collectionName), dataProduct)
    //         return {status: true, message:"product berhasil di tambahkan", id: newDocs.id}
    //     }catch(error){
    //         return {status: false, message:"terdapat kesalahan"}
    //     }
    // }
}

export function subscribeToFunFactSugars(callback: (funFactSugarEducation: educationsForFunfactSugar[]) => void){
    const q = query(collection(firestore, "funFactSugar"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataFunfactSugar = querySnapshot.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data()
        })) as educationsForFunfactSugar[]
        callback(dataFunfactSugar)
    })

    return unsubscribe
}


export function subscribeToReleatedArtikel(callback: (sugarRelatedJournalsEducation: educationsForArtikel[]) => void){
    const q = query(collection(firestore, "sugarRelatedJournals"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataReleatedArtikel = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as educationsForArtikel[]

        callback(dataReleatedArtikel)
    })

    return unsubscribe
}


export function subscribeToVideoEducation(callback: (videoEducationsEducation: educationsForVideo[]) => void){
    const q = query(collection(firestore, "videoEducations"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataVideoEducation = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as educationsForVideo[]

        callback(dataVideoEducation)
    })

    return unsubscribe
}