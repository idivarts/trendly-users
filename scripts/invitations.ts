import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";

export const populateApplications = async (
  db: Firestore,
  dummyApplications: any[],
  userId: string
) => {
  const collaborationsCollection = collection(db, "collaborations");
  const collabDataFetch = await getDocs(collaborationsCollection);
  const collabData = collabDataFetch.docs.map((doc) => ({
    id: doc.id,
    managerId: doc.data().managerId,
    ...doc.data(),
  }));
  for (const collab of collabData) {
    const applicationsCollection = collection(
      db,
      "collaborations",
      collab.id,
      "invitations"
    );

    for (const application of dummyApplications) {
      try {
        // Adding each application to Firestore
        await addDoc(applicationsCollection, {
          userId: userId,
          collaborationId: collab.id,
          managerId: collab.managerId,
          status: application.status,
          message: application.message,
          timeStamp: application.timeStamp,
        });

        CrashLog.log(
          `Application for collaboration ${collab.id} added successfully.`
        );
      } catch (error) {
        CrashLog.error(
          error,
          `Failed to add application for collaboration ${collab.id}`
        );
      }
    }
  }
};
