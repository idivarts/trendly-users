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
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { User } from "@/types/User";
import { signInAnonymously } from "firebase/auth";
import { AuthApp } from "@/utils/auth";
import { DUMMY_USER_ID } from "@/constants/User";
import { logEvent } from "firebase/analytics";
import { Platform } from "react-native";
import analyticsWeb from "@/utils/analytics-web";
import analytics from '@react-native-firebase/analytics';

interface AuthContextProps {
  isLoading: boolean;
  session?: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  signUp: () => void;
  getUser: (userId: string) => Promise<User | null>;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  isLoading: false,
  session: null,
  signIn: () => null,
  signOut: () => null,
  signUp: () => null,
  getUser: () => Promise.resolve(null),
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
    await signInAnonymously(AuthApp);
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

  const signIn = async (token: string) => {
    setSession(token);
    if (Platform.OS === 'web') {
      logEvent(
        analyticsWeb,
        'signed_in',
        {
          method: 'email_password',
        }
      );
    } else {
      await analytics().logEvent(
        'login',
        {
          method: 'email_password',
        },
      );
    }
    // For existing users, redirect to the main screen.
    router.replace("/questions");
    Toaster.success("Signed In Successfully!");
  };

  const signUp = async () => {
    setSession(DUMMY_USER_ID);
    // For non-existing users, redirect to the onboarding screen.
    router.replace("/questions");
    Toaster.success("Signed Up Successfully!");
  };

  const signOut = async () => {
    setSession("");
    if (Platform.OS === 'web') {
      logEvent(
        analyticsWeb,
        'signed_out',
        {
          id: user?.id,
          email: user?.email,
        },
      );
    } else {
      await analytics().logEvent(
        'signed_out',
        {
          id: user?.id,
          email: user?.email,
        },
      );
    }
    router.replace("/pre-signin");
    Toaster.success("Signed Out Successfully!");
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
    await signInAnonymously(AuthApp);
    const userRef = doc(FirestoreDB, "users", userId);

    await updateDoc(userRef, {
      ...user,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        signIn,
        signOut,
        signUp,
        getUser,
        updateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
