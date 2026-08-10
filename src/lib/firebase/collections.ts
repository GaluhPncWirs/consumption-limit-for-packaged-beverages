import { getFirestore } from "firebase-admin/firestore";
import { app } from "./init";

const firestore = getFirestore(app);

export const collectionNutritionFact = firestore.collection("nutritionFact");
export const collectionFunFactSugar = firestore.collection("funFactSugar");
export const collectionSugarRelatedJournals = firestore.collection(
  "sugarRelatedJournals",
);
export const collectionVideoEducations =
  firestore.collection("videoEducations");
