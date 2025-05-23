import { useInitialUserData } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { OAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new OAuthProvider('apple.com');
provider.addScope('email');
provider.addScope('name');

export const useAppleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();
    const INTIAL_DATA = useInitialUserData()

    const evalResult = async (result: void | UserCredential) => {
        if (!result) return;

        setLoading(true);
        const userRef = doc(FirestoreDB, "users", result.user.uid);
        const findUser = await getDoc(userRef);
        const isExistingUser = findUser.exists();

        if (!isExistingUser) {
            const userData = {
                ...INTIAL_DATA,
                isVerified: true,
                name: result.user.displayName || "Apple User",
                email: result.user.email || "",
                profileImage: result.user.photoURL || "",
                creationTime: Date.now(),
            };
            await setDoc(userRef, userData);
        }

        if (isExistingUser) {
            firebaseSignIn(result.user.uid);
        } else {
            firebaseSignUp(result.user.uid, 0);
        }

        Toaster.success('Logged in with Apple successfully');
    };

    const appleLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(AuthApp, provider);
            await evalResult(result);
        } catch (error: any) {
            console.log("Error logging in with Apple:", error);
            Toaster.error('Error logging in with Apple', error?.message || '');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        appleLogin,
        isAppleAvailable: true
    };
};