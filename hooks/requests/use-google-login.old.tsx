import { useInitialUserData } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import { Console } from "@/shared-libs/utils/console";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";


export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();
    const INTIAL_DATA = useInitialUserData()

    // const redirectUri = makeRedirectUri({
    //     native: 'trendly-creators',
    // });

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '799278694891-6cubib0gjb4kp81vq5bi8ulu4q7amduv.apps.googleusercontent.com',
        androidClientId: '799278694891-4boqousbd7vfevm9p8s24n1h5gc9u49o.apps.googleusercontent.com',
        // webClientId: "799278694891-mqote8c8hpb4952l2hg9hchkni8js2k5.apps.googleusercontent.com",
        // redirectUri
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
            const result = await promptAsync();
            if (result?.type === 'success' && result.authentication) {
                setLoading(true);
                const credential = GoogleAuthProvider.credential(result.authentication.idToken, result.authentication.accessToken);
                const firebaseResult = await signInWithCredential(AuthApp, credential);
                await evalResult(firebaseResult);
            } else {
                Toaster.error('Google sign-in cancelled or failed');
                Console.log("Google sign-in cancelled or failed", result);
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