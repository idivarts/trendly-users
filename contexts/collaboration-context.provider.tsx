import {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import { updateDoc, doc, collection } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";

import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";

interface CollaborationContextProps {
  updateApplication: (
    userId: string,
    collaborationId: string,
    application: Partial<IApplications>
  ) => Promise<void>;
}

const CollaborationContext = createContext<CollaborationContextProps>({
  updateApplication: () => Promise.resolve(),
});

export const useCollaborationContext = () => useContext(CollaborationContext);

export const CollaborationContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
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
        updateApplication,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};
