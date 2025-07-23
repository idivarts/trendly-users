import { useAuthContext } from "@/contexts/auth-context.provider";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

export const useApplication = () => {
    const { user } = useAuthContext()
    const insertApplication = async (collaborationId: string, application: IApplications) => {
        if (!user || !AuthApp.currentUser)
            throw "User not initialized"

        const uid = AuthApp.currentUser.uid
        const applicantColRef = collection(
            FirestoreDB,
            "collaborations",
            collaborationId,
            "applications"
        );
        if (typeof application.quotation != "number")
            application.quotation = parseInt(application.quotation)
        const applicantDocRef = doc(applicantColRef, uid);
        await setDoc(applicantDocRef, application)
        HttpWrapper.fetch(`/api/collabs/collaborations/${collaborationId}/applications/${uid}`, {
            method: "POST"
        })
    }

    const updateApplication = async (collaborationId: string, application: Partial<IApplications>) => {
        if (!user || !AuthApp.currentUser)
            throw "User not initialized"

        const uid = AuthApp.currentUser.uid
        const applicantColRef = collection(
            FirestoreDB,
            "collaborations",
            collaborationId,
            "applications"
        );
        const applicantDocRef = doc(applicantColRef, uid);
        if (application.quotation && typeof application.quotation != "number")
            application.quotation = parseInt(application.quotation)
        await updateDoc(applicantDocRef, application)
        HttpWrapper.fetch(`/api/collabs/collaborations/${collaborationId}/applications/${uid}`, {
            method: "PUT"
        })
    }

    return {
        insertApplication,
        updateApplication
    }
}