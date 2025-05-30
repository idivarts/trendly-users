import { useInitialUserData } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();
    const INTIAL_DATA = useInitialUserData()

    const evalResult = async (result: void | UserCredential) => {
        if (!result)
            return;

        setLoading(true)
        const userRef = await doc(FirestoreDB, "users", result.user.uid);
        const findUser = await getDoc(userRef);
        const isExistingUser = findUser.exists();

        if (!isExistingUser) {
            const userData = {
                ...INTIAL_DATA,
                isVerified: true,
                name: result.user.displayName,
                email: result.user.email || "",
                profileImage: result.user.photoURL || "",
                creationTime: Date.now(),
            };
            await setDoc(userRef, userData);
        }
        // userRef.
        if (isExistingUser) {
            firebaseSignIn(result.user.uid);
        } else {
            firebaseSignUp(result.user.uid, 0);
        }
        Toaster.success('Logged in with Google successfully');
    }

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(AuthApp, provider);
            setLoading(true);
            await evalResult(result);
        } catch (error: any) {
            Console.log("Error logging in with Google:", error);
            Toaster.error('Error logging in with Google', error?.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        googleLogin
    }
}