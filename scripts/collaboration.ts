import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";
import { collaborationsData } from "./dummy-data/collaboration";
import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";

async function helper(
  FirestoreDB: Firestore,
  brandIds: string[],
  managerId: string
) {
  for (const collaboration of collaborationsData) {
    const randomBrandIndex = Math.floor(Math.random() * brandIds.length);
    const collaborationRef = collection(FirestoreDB, "collaborations");

    await addDoc(collaborationRef, {
      ...collaboration,
      brandId: brandIds[randomBrandIndex],
      managerId,
    });
  }
}

export async function populateCollaborations(
  FirestoreDB: Firestore,
  managerId: string
) {
  const brands = collection(FirestoreDB, "brands");
  const brandIds: string[] = [];

  const brandDocs = await getDocs(brands);
  brandDocs.forEach((doc) => {
    brandIds.push(doc.id);
  });

  await helper(FirestoreDB, brandIds, managerId);
}

// populateFirestore().catch(console.error);
