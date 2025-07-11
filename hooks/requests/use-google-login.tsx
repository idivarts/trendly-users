import { useInitialUserData } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { GoogleAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";

import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import {
    GoogleSignin,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { useEffect } from "react";


export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();
    const INTIAL_DATA = useInitialUserData()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "799278694891-mqote8c8hpb4952l2hg9hchkni8js2k5.apps.googleusercontent.com",
            offlineAccess: true
        })
    }, [])

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
            await GoogleSignin.hasPlayServices();
            if (GoogleSignin.hasPreviousSignIn()) {
                await GoogleSignin.signOut()
            }
            const signInResponse = await GoogleSignin.signIn()
            if (isSuccessResponse(signInResponse)) {
                setLoading(true);
                const idToken = signInResponse?.data?.idToken;
                if (!idToken)
                    throw new Error("Missing Google ID Token from sign-in response");

                const credential = GoogleAuthProvider.credential(idToken);
                const firebaseResult = await signInWithCredential(AuthApp, credential);
                await evalResult(firebaseResult);
            } else if (signInResponse.type === 'cancelled') {
                Toaster.error('Google sign-in cancelled or failed');
                Console.log("Google sign-in cancelled or failed", signInResponse);
                setError('cancelled');
            }
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