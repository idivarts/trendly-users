import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { collection, doc, getDoc } from "firebase/firestore";
import {
    createContext,
    useContext,
    type PropsWithChildren,
} from "react";
;

import { useApplication } from "@/components/proposals/useApplication";
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
    const { updateApplication: mainUpdateApplication } = useApplication()
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
        await mainUpdateApplication(collaborationId, application)
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
