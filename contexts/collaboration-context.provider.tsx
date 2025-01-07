import {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import { updateDoc, doc, getDoc, collection } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";

import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { Application } from "@/types/Collaboration";

interface CollaborationContextProps {
  getApplicationById: (
    userId: string,
    collaborationId: string
  ) => Promise<Application | null>;
  updateApplication: (
    userId: string,
    collaborationId: string,
    application: Partial<IApplications>
  ) => Promise<void>;
}

const CollaborationContext = createContext<CollaborationContextProps>({
  getApplicationById: () => Promise.resolve(null),
  updateApplication: () => Promise.resolve(),
});

export const useCollaborationContext = () => useContext(CollaborationContext);

export const CollaborationContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const getApplicationById = async (
    userId: string,
    collaborationId: string
  ): Promise<Application | null> => {
    const applicationColRef = collection(
      FirestoreDB,
      "collaborations",
      collaborationId,
      "applications"
    );

    const applicationDocRef = doc(applicationColRef, userId);
    const applicationDoc = await getDoc(applicationDocRef);

    if (applicationDoc.exists()) {
      return {
        ...applicationDoc.data(),
        id: applicationDoc.id,
      } as Application;
    }

    return null;
  }

  const updateApplication = async (
    userId: string,
    collaborationId: string,
    application: Partial<IApplications>,
  ) => {
    const applicationColRef = collection(
      FirestoreDB,
      "collaborations",
      collaborationId,
      "applications"
    );

    const applicationDocRef = doc(applicationColRef, userId);
    await updateDoc(applicationDocRef, application);
  }

  return (
    <CollaborationContext.Provider
      value={{
        getApplicationById,
        updateApplication,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};
