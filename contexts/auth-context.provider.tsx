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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { User } from "@/types/User";
import { AuthApp } from "@/utils/auth";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { analyticsLogEvent } from "@/utils/analytics";
import { INITIAL_USER_DATA } from "@/constants/User";

interface AuthContextProps {
  deleteUserAccount: (userId: string) => Promise<void>;
  firebaseSignIn: (token: string) => void;
  firebaseSignUp: (token: string, hasSocials?: boolean) => void;
  getUser: (userId: string) => Promise<User | null>;
  isLoading: boolean;
  session?: string | null;
  signIn: (email: string, password: string) => void;
  signOutUser: () => void;
  signUp: (name: string, email: string, password: string) => void;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  user: User | null;
  verifyEmail: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  deleteUserAccount: () => Promise.resolve(),
  firebaseSignIn: (token: string) => null,
  firebaseSignUp: (token: string, hasSocials?: boolean) => null,
  getUser: () => Promise.resolve(null),
  isLoading: false,
  session: null,
  signIn: (email: string, password: string) => null,
  signOutUser: () => null,
  signUp: (name: string, email: string, password: string) => null,
  updateUser: () => Promise.resolve(),
  user: null,
  verifyEmail: () => null,
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

      await fetch("https://be.trendly.pro/api/v1/chat/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userCredential.user.uid}`,
        },
      });

      await analyticsLogEvent("signed_in", {
        id: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
      });

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
        ...INITIAL_USER_DATA,
      });

      setSession(userCredential.user.uid);

      await fetch("https://be.trendly.pro/api/v1/chat/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userCredential.user.uid}`,
        },
      });

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

  const firebaseSignUp = async (token: string, hasSocials?: boolean) => {
    setSession(token);
    if (hasSocials) {
      router.replace("/questions");
      Toaster.success("Signed Up Successfully!");
    } else {
      router.replace("/no-social-connected");
      Toaster.success("Signed Up Successfully!");
    }
  };

  const verifyEmail = async () => {
    const userCredential = AuthApp.currentUser;

    await userCredential?.reload();

    if (userCredential?.emailVerified) {
      Toaster.error("Email is already verified.");
      if (!user?.emailVerified) {
        await updateUser(user?.id as string, {
          emailVerified: true,
        });
      }
      return;
    }

    if (!userCredential) {
      Toaster.error("User not found.");
      return;
    }

    await sendEmailVerification(userCredential).then(() => {
      Toaster.success("Verification email sent successfully.");
    });
  };

  const verifyPhoneNumber = async (phoneNumber: string) => {
    const userCredential = AuthApp.currentUser;

    if (!userCredential) {
      Toaster.error("User not found.");
      return;
    }
  };

  const signOutUser = () => {
    signOut(AuthApp)
      .then(() => {
        setSession("");

        analyticsLogEvent("signed_out", {
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

  const deleteUserReferences = async (
    userId: string,
    collectionName: string,
    subcollectionName: string
  ) => {
    const mainCollectionRef = collection(FirestoreDB, collectionName);
    const mainCollectionSnapshot = await getDocs(mainCollectionRef);

    for (const mainDoc of mainCollectionSnapshot.docs) {
      const subcollectionRef = collection(mainDoc.ref, subcollectionName);
      const userQuery = query(subcollectionRef, where("userId", "==", userId));
      const userSnapshot = await getDocs(userQuery);

      userSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    }
  };

  const deleteManagerNotifications = async (userId: string) => {
    const managersRef = collection(FirestoreDB, "managers");
    const managersSnapshot = await getDocs(managersRef);

    for (const managerDoc of managersSnapshot.docs) {
      const notificationsRef = collection(managerDoc.ref, "notifications");
      const userQuery = query(
        notificationsRef,
        where("data.userId", "==", userId)
      );
      const notificationsSnapshot = await getDocs(userQuery);

      notificationsSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    }
  };

  const deleteUserAccount = async (userId: string) => {
    try {
      const user = AuthApp.currentUser;

      if (!user) {
        console.error("No authenticated user.");
        return;
      }

      const batch = writeBatch(FirestoreDB);

      const notificationsRef = collection(
        FirestoreDB,
        `users/${userId}/notifications`
      );
      const notificationsSnapshot = await getDocs(notificationsRef);

      notificationsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await deleteUserReferences(userId, "collaborations", "applications");

      await deleteUserReferences(userId, "collaborations", "invitations");

      await deleteManagerNotifications(userId);

      const userDocRef = doc(FirestoreDB, "users", userId);
      batch.delete(userDocRef);

      await batch.commit();

      await deleteUser(user);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        deleteUserAccount,
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
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
