import { collectionNutritionFact } from "@/lib/firebase/collections";
import { searchData } from "@/repositories/searchData";
import { getDocs } from "firebase/firestore";

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
