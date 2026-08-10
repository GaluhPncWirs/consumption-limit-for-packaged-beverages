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

// export async function updateNameProductLowerCase() {
//   try {
//     const snapshot = await getDocs(collectionNutritionFact);

//     const batch = writeBatch(db);

//     let updatedCount = 0;

//     snapshot.docs.forEach((item) => {
//       const data = item.data();

//       if (typeof data.nameProduct !== "string" || !data.nameProduct.trim()) {
//         return;
//       }

//       if (data.nameProductLowerCase) {
//         return;
//       }

//       batch.update(doc(db, "nutritionFact", item.id), {
//         nameProductLowerCase: data.nameProduct.trim().toLowerCase(),
//       });

//       updatedCount++;
//     });

//     if (updatedCount === 0) {
//       return {
//         status: true,
//         total: snapshot.size,
//         updated: 0,
//         message: "Tidak ada data yang perlu diperbarui",
//       };
//     }

//     await batch.commit();

//     return {
//       status: true,
//       total: snapshot.size,
//       updated: updatedCount,
//       message: `${updatedCount} data berhasil diperbarui`,
//     };
//   } catch (error) {
//     console.error("Gagal update nameProductLowerCase:", error);

//     return {
//       status: false,
//       message: "Gagal memperbarui data",
//     };
//   }
// }

// await updateNameProductLowerCase();
