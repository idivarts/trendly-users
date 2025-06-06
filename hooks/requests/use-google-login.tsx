import { Console } from "@/shared-libs/utils/console";
import Toaster from "@/shared-uis/components/toaster/Toaster";

export const useGoogleLogin = (setLoading: Function, setError: Function) => {
    // const { firebaseSignIn, firebaseSignUp } = useAuthContext();

    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     iosClientId: '799278694891-6cubib0gjb4kp81vq5bi8ulu4q7amduv.apps.googleusercontent.com',
    //     androidClientId: '799278694891-n7ab0u2o9cfqol8b07mr51imdham6ioe.apps.googleusercontent.com',
    // });

    // const evalResult = async (result: void | UserCredential) => {
    //     if (!result)
    //         return;

    //     setLoading(true)
    //     const userRef = await doc(FirestoreDB, "users", result.user.uid);
    //     const findUser = await getDoc(userRef);
    //     const isExistingUser = findUser.exists();

    //     if (!isExistingUser) {
    //         const userData = {
    //             ...INITIAL_USER_DATA,
    //             isVerified: true,
    //             name: result.user.displayName,
    //             email: result.user.email || "",
    //             profileImage: result.user.photoURL || "",
    //             creationTime: Date.now(),
    //         };
    //         await setDoc(userRef, userData);
    //     }
    //     // userRef.
    //     if (isExistingUser) {
    //         firebaseSignIn(result.user.uid);
    //     } else {
    //         firebaseSignUp(result.user.uid, 0);
    //     }
    //     Toaster.success('Logged in with Google successfully');
    // }

    const googleLogin = async () => {
        try {
            // const result = await promptAsync();
            // if (result?.type === 'success' && result.authentication) {
            //     setLoading(true);
            //     const credential = GoogleAuthProvider.credential(result.authentication.idToken, result.authentication.accessToken);
            //     const firebaseResult = await signInWithCredential(AuthApp, credential);
            //     await evalResult(firebaseResult);
            // } else {
            //     Toaster.error('Google sign-in cancelled or failed');
            //     Console.log("Google sign-in cancelled or failed", result);
            //     setError('cancelled');
            // }
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