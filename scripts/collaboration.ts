import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";
import { collaborationsData } from "./dummy-data/collaboration";


async function helper(
  FirestoreDB: Firestore,
  brands: {
    id: string;
    managerId: string;
  }[]
) {
  for (const collaboration of collaborationsData) {
    const randomBrandIndex = Math.floor(Math.random() * brands.length);
    const collaborationRef = collection(FirestoreDB, "collaborations");

    await addDoc(collaborationRef, {
      ...collaboration,
      brandId: brands[randomBrandIndex].id,
      managerId: brands[randomBrandIndex].managerId,
    });
  }
}

export async function populateCollaborations(FirestoreDB: Firestore) {

  try {
    const brands = collection(FirestoreDB, "brands");
    const brandsList: { id: string; managerId: string }[] = [];

    const brandDocs = await getDocs(brands);

    for (const doc of brandDocs.docs) {
      const managerCollection = collection(
        FirestoreDB,
        "brands",
        doc.id,
        "members"
      );
      const managerDocs = await getDocs(managerCollection);

      // Ensure the collection has at least one member
      if (managerDocs.docs.length > 0) {
        brandsList.push({
          id: doc.id,
          managerId: managerDocs.docs[0].id,
        });
      } else {
        CrashLog.log(`No members found for brand ${doc.id}`);
      }
    }

    await helper(FirestoreDB, brandsList);
  } catch (e) {
    CrashLog.error(e);
  }
}

