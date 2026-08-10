import { collection, getFirestore } from "firebase/firestore";

import { app } from "./init";

export const db = getFirestore(app);

export const collectionNutritionFact = collection(db, "nutritionFact");

export const collectionFunFactSugar = collection(db, "funFactSugar");

export const collectionSugarRelatedJournals = collection(
  db,
  "sugarRelatedJournals",
);

export const collectionVideoEducations = collection(db, "videoEducations");
