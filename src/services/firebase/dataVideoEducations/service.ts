import { collectionVideoEducations } from "@/lib/firebase/collections";
import { getRandomData } from "@/repositories/getRandomData";

export async function getDataVideoEducations() {
  try {
    const getDataRandom = await getRandomData(collectionVideoEducations);
    return {
      status: true,
      data: getDataRandom,
    };
  } catch (error) {
    console.error("Firestore error:", error);
    return { status: false, message: "Terdapat Kesalahan" };
  }
}
