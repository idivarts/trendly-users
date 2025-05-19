import { INITIAL_USER_DATA } from "@/constants/User";
import { useStorageState } from "@/hooks";
import { AccountStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import { analyticsLogEvent } from "@/shared-libs/utils/firebase/analytics";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { updatedTokens } from "@/utils/push-notification/push-notification-token.native";
import { resetAndNavigate } from "@/utils/router";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
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
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";
;
;

interface AuthContextProps {
  deleteUserAccount: (userId: string) => Promise<void>;
  firebaseSignIn: (token: string) => void;
  firebaseSignUp: (token: string, hasSocials?: number) => void;
  getUser: (userId: string) => Promise<User | null>;
  isLoading: boolean;
  isUserLoading: boolean;
  session?: string | null;
  signIn: (email: string, password: string) => void;
  signOutUser: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => void;
  updateUser: (userId: string, user: Partial<User>) => Promise<void>;
  user: User | null;
  verifyEmail: () => void;
  collaborationId?: string;
  setCollaborationId?: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextProps>({
  deleteUserAccount: () => Promise.resolve(),
  firebaseSignIn: (token: string) => null,
  firebaseSignUp: (token: string, hasSocials?: number) => null,
  getUser: () => Promise.resolve(null),
  isLoading: false,
  isUserLoading: false,
  session: null,
  signIn: (email: string, password: string) => null,
  signOutUser: async () => { },
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
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [collaborationId, setCollaborationId] = useState<string>("");

  const fetchUser = async () => {
    if (!isLoading && session) {
      // setIsUserLoading(true);
      const userDocRef = doc(FirestoreDB, "users", session);

      const unsubscribe = onSnapshot(userDocRef, (userSnap) => {
        if (userSnap.exists()) {
          const userData = {
            ...(userSnap.data() as User),
            id: userSnap.id as string,
          };
          setUser(userData);
          setIsUserLoading(false);
        } else {
          console.error("User not found");
          setIsUserLoading(false);
        }
      });

      return unsubscribe;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session, isLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        AuthApp,
        email,
        password
      );

      setSession(userCredential.user.uid);

      HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST", });

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
        creationTime: Date.now(),
      });

      setSession(userCredential.user.uid);

      HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST" });

      // After signup, redirect user to the no-social-connected.
      resetAndNavigate("/no-social-connected");
      Toaster.success("Signed Up Successfully!");
    } catch (error) {
      console.error("Error signing up: ", error);
      Toaster.error("Error signing up. Please try again.");
    }
  };

  const firebaseSignIn = async (uid: string) => {
    // console.log("Firebase Sign In", uid);

    setSession(uid);
    HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST" });

    if (collaborationId)
      resetAndNavigate(`/collaboration-details/${collaborationId}`);
    else
      resetAndNavigate("/collaborations");

    if (user?.settings?.accountStatus != AccountStatus.Activated)
      updateUser(uid, {
        settings: {
          accountStatus: AccountStatus.Activated
        }
      })

    Toaster.success("Signed In Successfully!");
  };

  const firebaseSignUp = async (uid: string, hasSocials?: number) => {
    // console.log("Firebase Sign Up", uid, hasSocials);

    setSession(uid);
    HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST", });

    if (!hasSocials) {
      resetAndNavigate("/no-social-connected");
      Toaster.success("Signed Up Successfully!");
    } else if (hasSocials == 1) {
      resetAndNavigate("/questions");
      Toaster.success("Signed Up Successfully!");
    } else if (hasSocials > 1) {
      resetAndNavigate("/primary-social-select");
      Toaster.success("Signed Up Successfully!");
    }
  };

  const verifyEmail = async () => {
    const userCredential = AuthApp.currentUser;

    if (userCredential?.emailVerified) {
      Toaster.error("Email is already verified.");
      return;
    }

    if (!userCredential || !user) {
      Toaster.error("User not found.");
      return;
    }

    await sendEmailVerification(userCredential).then(() => {
      Toaster.success("Verification email sent successfully.");
    });

    const checkVerification = async () => {
      await userCredential.reload();
      if (userCredential.emailVerified) {
        await updateUser(user?.id as string, {
          emailVerified: true,
          profile: {
            completionPercentage: (user?.profile?.completionPercentage || 0) + 10,
          }
        });
        Toaster.success("Email verified successfully.");
      } else {
        setTimeout(checkVerification, 2000);
      }
    }

    checkVerification();
  };

  const verifyPhoneNumber = async (phoneNumber: string) => {
    const userCredential = AuthApp.currentUser;

    if (!userCredential) {
      Toaster.error("User not found.");
      return;
    }
  };

  const signOutUser = async () => {
    try {
      if (Platform.OS !== "web") {
        // Remove push notification token from the database
        const newUpdatedTokens = await updatedTokens(user);

        if (newUpdatedTokens) {
          await updateUser(session as string, {
            pushNotificationToken: newUpdatedTokens,
          });
        }
      }
    } catch (e) {
      console.log("Issues while removing tokens", e);
    }

    signOut(AuthApp)
      .then(() => {
        setSession("");
        setUser(null);

        analyticsLogEvent("signed_out", {
          id: user?.id,
          email: user?.email,
        });

        resetAndNavigate("/pre-signin");
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
        isUserLoading,
        session,
        signIn,
        signOutUser,
        signUp,
        updateUser,
        user,
        verifyEmail,
        collaborationId,
        setCollaborationId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
