import {
    createContext,
    useContext,
    type PropsWithChildren,
} from "react";

import { StorageApp } from "@/shared-libs/utils/firebase/firebase-storage";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from "firebase/storage";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
;

interface FirebaseStorageContextProps {
    uploadImage: (image: string, path: string) => Promise<string>;
    uploadImageBytes: (blob: Blob, path: string) => Promise<string>;
}

const FirebaseStorageContext = createContext<FirebaseStorageContextProps>(null!);

export const useFirebaseStorageContext = () => useContext(FirebaseStorageContext);

export const FirebaseStorageContextProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const uploadImage = async (
        image: string,
        path: string,
        format: "base64" | "base64url" | "data_url" | "raw" = "data_url",
    ): Promise<string> => {
        const storageRef = ref(StorageApp, path);
        await uploadString(storageRef, image, format);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }

    const uploadImageBytes = async (
        blob: Blob,
        path: string,
    ): Promise<string> => {
        const storageRef = ref(StorageApp, path);
        try {
            await uploadBytes(storageRef, blob);
        } catch (error) {
            const parsed = await HttpWrapper.extractErrorMessage(error);
            console.log("[FirebaseStorage] uploadBytes failed", {
                path,
                error: parsed,
                raw: error,
            });
            throw new Error(parsed || "You don't have permission to upload to Firebase Storage.");
        }

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }

    return (
        <FirebaseStorageContext.Provider
            value={{
                uploadImage,
                uploadImageBytes,
            }}
        >
            {children}
        </FirebaseStorageContext.Provider>
    );
};