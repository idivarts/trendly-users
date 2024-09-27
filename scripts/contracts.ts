import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";

export const populateContracts = async (
  db: Firestore,
  dummyApplications: any[],
  userId: string
) => {
  const brandsCollections = collection(db, "brands");
  const brandDataFetch = await getDocs(brandsCollections);
  const brandData = brandDataFetch.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  for (const brand of brandData) {
    const applicationsCollection = collection(db, "contracts");

    const managerCol = collection(db, "brands", brand.id, "members");
    const managerDataFetch = await getDocs(managerCol);
    const managerData = managerDataFetch.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const application of dummyApplications) {
      try {
        // Adding each application to Firestore
        await addDoc(applicationsCollection, {
          userId: userId,
          brandId: brand.id,
          managerId: managerData[0].managerId,
          startDate: application.startDate,
          endDate: application.endDate,
          status: application.status,
        });

        console.log(
          `Application for collaboration ${brand.id} added successfully.`
        );
      } catch (error) {
        console.error(
          `Failed to add application for collaboration ${brand.id}:`,
          error
        );
      }
    }
  }
};
