import { collectionSugarRelatedJournals } from "@/lib/firebase/collections";
import { getRandomData } from "@/repositories/getRandomData";

export async function getDataRelatedJournals() {
  try {
    const getDataRandom = await getRandomData(collectionSugarRelatedJournals);
    return {
      status: true,
      data: getDataRandom,
    };
  } catch (error) {
    console.error("Firestore error:", error);
    return { status: false, message: "Terdapat Kesalahan" };
  }
}
