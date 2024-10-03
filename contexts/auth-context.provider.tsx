import { useStorageState } from "@/hooks";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { User } from "@/types/User";
import { AuthApp } from "@/utils/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { analyticsLogEvent } from "@/utils/analytics";

interface AuthContextProps {
  firebaseSignIn: (token: string) => void;
  firebaseSignUp: (token: string) => void;
  getUser: (userId: string) => Promise<User | null>;
  isLoading: boolean;
  session?: string | null;
  signIn: (email: string, password: string) => void;
  signOutUser: () => void;
  signUp: (name: string, email: string, password: string) => void;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  firebaseSignIn: (token: string) => null,
  firebaseSignUp: (token: string) => null,
  getUser: () => Promise.resolve(null),
  isLoading: false,
  session: null,
  signIn: (email: string, password: string) => null,
  signOutUser: () => null,
  signUp: (name: string, email: string, password: string) => null,
  updateUser: () => Promise.resolve(),
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [[isLoading, session], setSession] = useStorageState("id");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    if (session) {
      const userDocRef = doc(FirestoreDB, "users", session);

      const unsubscribe = onSnapshot(userDocRef, (userSnap) => {
        if (userSnap.exists()) {
          const userData = {
            ...(userSnap.data() as User),
            id: userSnap.id as string,
          };
          setUser(userData);
        } else {
          console.error("User not found");
        }
      });

      return unsubscribe;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        AuthApp,
        email,
        password
      );
      setSession(userCredential.user.uid);

      await analyticsLogEvent('signed_in', {
        id: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
      });

      // For existing users, redirect to the main screen.
      router.replace("/collaborations");
      Toaster.success("Signed In Successfully!");
    } catch (error) {
      console.error("Error signing in: ", error);
      Toaster.error("Error signing in. Please try again.");
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        AuthApp,
        email,
        password
      );

      await setDoc(doc(FirestoreDB, "users", userCredential.user.uid), {
        name,
        email,
        location: "",
        phoneNumber: "",
        preferences: {
          question1: "",
          question2: "",
          question3: "",
        },
        profileImage: "",
        settings: {
          emailNotifications: true,
          pushNotifications: true,
          theme: "light",
        },
      });

      setSession(userCredential.user.uid);

      // For non-existing users, redirect to the onboarding screen.
      router.replace("/questions");
      Toaster.success("Signed Up Successfully!");
    } catch (error) {
      console.error("Error signing up: ", error);
      Toaster.error("Error signing up. Please try again.");
    }
  };

  const firebaseSignIn = async (token: string) => {
    setSession(token);

    router.replace("/collaborations");
    Toaster.success("Signed In Successfully!");
  };

  const firebaseSignUp = async (token: string) => {
    setSession(token);
    router.replace("/questions");
    Toaster.success("Signed Up Successfully!");
  };

  const signOutUser = () => {
    signOut(AuthApp)
      .then(() => {
        setSession("");

        analyticsLogEvent('signed_out', {
          id: user?.id,
          email: user?.email,
        });

        router.replace("/pre-signin");
        Toaster.success("Signed Out Successfully!");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const getUser = async (userId: string): Promise<User | null> => {
    const userRef = doc(FirestoreDB, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = {
        ...(userSnap.data() as User),
        id: userSnap.id as string,
      };
      setUser(userData);
      return userData;
    }

    return null;
  };

  const updateUser = async (
    userId: string,
    user: Partial<User>
  ): Promise<void> => {
    const userRef = doc(FirestoreDB, "users", userId);

    await updateDoc(userRef, {
      ...user,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseSignIn,
        firebaseSignUp,
        getUser,
        isLoading,
        session,
        signIn,
        signOutUser,
        signUp,
        updateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
