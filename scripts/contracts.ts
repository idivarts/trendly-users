import { Console } from "@/shared-libs/utils/console";
import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";

export const populateContracts = async (
  db: Firestore,
  dummyApplications: any[],
  userId: string
) => {
  const collabCollections = collection(db, "collaborations");
  const collabDataFetch = await getDocs(collabCollections);
  const collabData = collabDataFetch.docs.map((doc) => ({
    id: doc.id,
    brandId: doc.data().brandId,
    managerId: doc.data().managerId,
    ...doc.data(),
  }));
  for (const collab of collabData) {
    const applicationsCollection = collection(db, "contracts");
    for (const application of dummyApplications) {
      try {
        // Adding each application to Firestore
        await addDoc(applicationsCollection, {
          userId: userId,
          brandId: collab.brandId,
          managerId: collab.managerId,
          collaborationId: collab.id,
          startDate: application.startDate,
          endDate: application.endDate,
          status: application.status,
        });

        Console.log(
          `Application for collaboration ${collab.id} added successfully.`
        );
      } catch (error) {
        Console.error(error, `Failed to add application for collaboration ${collab.id}:`);
      }
    }
  }
};
