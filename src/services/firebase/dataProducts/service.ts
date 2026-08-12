import { collectionNutritionFact } from "@/lib/firebase/collections";
import { searchData } from "@/repositories/searchData";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

export async function getDataRegister(keyword: string) {
  try {
    const querySearch = searchData({
      collectionRef: collectionNutritionFact,
      search: { keyword, field: "nameProductLowerCase" },
    });

    const querySnapshot = await getDocs(querySearch);

    const dataProductsBeverage = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      status: true,
      data: dataProductsBeverage,
    };
  } catch (error) {
    console.error(error);
    return { status: false, message: "Terjadi kesalahan" };
  }
}

export async function addDataBeverage(dataProduct: {
  nameProduct: string;
  sugars: number;
  volume: number;
  type: string;
}) {
  try {
    const dataQuery = query(
      collectionNutritionFact,
      where("nameProduct", "==", dataProduct.nameProduct),
      limit(1),
    );

    const snapshot = await getDocs(dataQuery);

    if (!snapshot.empty) {
      return {
        status: false,
        message: "Produk minuman yang kamu masukkan sudah ada",
      };
    }

    await addDoc(collectionNutritionFact, dataProduct);

    return {
      status: true,
      message: "Produk berhasil ditambahkan",
    };
  } catch {
    return {
      status: false,
      message: "Terjadi kesalahan saat menambahkan produk",
    };
  }
}
