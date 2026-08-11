import {
  type CollectionReference,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export async function getRandomData(collectionRef: CollectionReference) {
  try {
    const random = Math.random();

    const q = query(
      collectionRef,
      where("randomNumber", ">=", random),
      orderBy("randomNumber"),
      limit(1),
    );

    let snapshot = await getDocs(q);

    if (snapshot.empty) {
      const fallbackQuery = query(
        collectionRef,
        orderBy("randomNumber"),
        limit(1),
      );

      snapshot = await getDocs(fallbackQuery);
    }

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (error) {
    console.error("Firestore error:", error);
    return { status: false, message: "Terdapat Kesalahan" };
  }
}
