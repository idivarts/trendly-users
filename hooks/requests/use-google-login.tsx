import { INITIAL_USER_DATA } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Platform } from 'react-native';

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: 'pro.trendly.creators',
        androidClientId: 'pro.trendly.creators',
    });

    const evalResult = async (result: void | UserCredential) => {
        if (!result)
            return;

        setLoading(true)
        const userRef = await doc(FirestoreDB, "users", result.user.uid);
        const findUser = await getDoc(userRef);
        const isExistingUser = findUser.exists();

        if (!isExistingUser) {
            const userData = {
                ...INITIAL_USER_DATA,
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
            if (Platform.OS === 'web') {
                setLoading(true);
                const result = await signInWithPopup(AuthApp, provider);
                await evalResult(result);
            } else {
                const result = await promptAsync();
                if (result?.type === 'success') {
                    setLoading(true);
                    const credential = GoogleAuthProvider.credential(null, result.authentication?.accessToken);
                    const firebaseResult = await signInWithCredential(AuthApp, credential);
                    await evalResult(firebaseResult);
                } else {
                    Toaster.error('Google sign-in cancelled or failed');
                    setError('cancelled');
                }
            }
        } catch (error: any) {
            console.log("Error logging in with Google:", error);
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