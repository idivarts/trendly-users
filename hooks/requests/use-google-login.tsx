import { INITIAL_USER_DATA } from "@/constants/User";
import { useAuthContext } from "@/contexts";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { browserPopupRedirectResolver, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
// provider.setCustomParameters({
//     'login_hint': 'user@example.com'
// });

export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    const { firebaseSignIn, firebaseSignUp } = useAuthContext();

    const evalResult = async (result: void | UserCredential) => {
        if (!result)
            return;

        Toaster.success('Logged in with Google successfully');
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
    }

    const googleLogin = () => {
        try {
            signInWithPopup(AuthApp, provider, browserPopupRedirectResolver).catch((error) => {
                Toaster.error('Error logging in with Google', error.message);
                console.log(error);
            }).then((result) => {
                evalResult(result);
            })
        } catch (e) {
            console.log("Error", e);
        } finally {
            setLoading(false);
        }
    }

    return {
        googleLogin
    }
}