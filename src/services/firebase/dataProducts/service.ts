import { collectionNutritionFact } from "@/lib/firebase/collections";
import { searchData } from "@/repositories/searchData";
import { getDocs } from "firebase/firestore";

export async function getDataRegister({ keyword }: { keyword: string }) {
  try {
    const query = searchData({
      // cast to any to avoid mismatched Firestore SDK CollectionReference types
      collectionRef: collectionNutritionFact as any,
      search: { keyword, field: "nameProduct" },
    });

    const querySnapshot = await getDocs(query);

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
