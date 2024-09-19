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

interface AuthContextProps {
  isLoading: boolean;
  session?: string | null;
  signIn: () => void;
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
  const userId = "IjOAHWjc3d8ff8u6Z2rD"; // TODO: get user id from session

  const fetchUser = async () => {
    if (session) {
      const userDocRef = doc(FirestoreDB, 'users', userId);

      const unsubscribe = onSnapshot(userDocRef, (userSnap) => {
        if (userSnap.exists()) {
          const userData = {
            ...userSnap.data() as User,
            id: userSnap.id as string,
          }
          setUser(userData);
        } else {
          console.error("User not found");
        }
      });

      return unsubscribe;
    }
  }

  useEffect(() => {
    fetchUser();
  }, [session]);

  const signIn = async () => {
    setSession('123');
    // For existing users, redirect to the main screen.
    router.replace("/proposals");
    Toaster.success("Signed In Successfully!");
  };

  const signUp = async () => {
    setSession('123');
    // For non-existing users, redirect to the onboarding screen.
    router.replace("/questions");
    Toaster.success("Signed Up Successfully!");
  };

  const signOut = () => {
    setSession("");
    router.replace("/login");
    Toaster.success("Signed Out Successfully!");
  };

  const getUser = async (
    userId: string,
  ): Promise<User | null> => {
    const userRef = doc(FirestoreDB, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = {
        ...userSnap.data() as User,
        id: userSnap.id as string,
      }
      setUser(userData);
      return userData;
    }

    return null;
  }

  const updateUser = async (
    userId: string,
    user: Partial<User>,
  ): Promise<void> => {
    const userRef = doc(FirestoreDB, "users", userId);

    await updateDoc(userRef, {
      ...user,
    });
  }

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
