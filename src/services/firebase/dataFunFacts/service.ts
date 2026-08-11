import { collectionFunFactSugar, db } from "@/lib/firebase/collections";
import { getRandomData } from "@/repositories/getRandomData";

export async function getDataFunFactData() {
  try {
    const getDataRandom = await getRandomData(collectionFunFactSugar);
    return {
      status: true,
      data: getDataRandom,
    };
  } catch (error) {
    console.error("Firestore error:", error);
    return { status: false, message: "Terdapat Kesalahan" };
  }
}
