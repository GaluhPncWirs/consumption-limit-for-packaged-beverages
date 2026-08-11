// import { collectionVideoEducations, db } from "@/lib/firebase/collections";
// import { doc, getDocs, writeBatch } from "firebase/firestore";

// export async function addDataField() {
//   try {
//     const snapshot = await getDocs(collectionVideoEducations);

//     console.log("Total data:", snapshot.size);

//     if (snapshot.empty) {
//       return {
//         status: true,
//         total: 0,
//         updated: 0,
//         message: "Tidak ada data yang perlu diperbarui",
//       };
//     }

//     let updatedCount = 0;
//     let batch = writeBatch(db);
//     let batchCount = 0;

//     for (const item of snapshot.docs) {
//       batch.update(doc(db, "videoEducations", item.id), {
//         randomNumber: Math.random(),
//       });

//       updatedCount++;
//       batchCount++;

//       if (batchCount === 500) {
//         await batch.commit();

//         console.log(`Batch ${batchCount} berhasil`);

//         batch = writeBatch(db);
//         batchCount = 0;
//       }
//     }

//     // Commit data yang tersisa
//     if (batchCount > 0) {
//       await batch.commit();

//       console.log(`Sisa ${batchCount} data berhasil`);
//     }

//     return {
//       status: true,
//       total: snapshot.size,
//       updated: updatedCount,
//       message: `${updatedCount} data berhasil diperbarui`,
//     };
//   } catch (error) {
//     console.error("Gagal update randomNumber:", error);

//     return {
//       status: false,
//       message:
//         error instanceof Error ? error.message : "Gagal memperbarui data",
//     };
//   }
// }
