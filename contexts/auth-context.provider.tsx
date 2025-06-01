import { useInitialUserData } from "@/constants/User";
import { useStorageState } from "@/hooks";
import { AccountStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { User } from "@/types/User";
import { resetAndNavigate } from "@/utils/router";
import { useSegments } from "expo-router";
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
  isLoggedIn: boolean;
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
  isLoggedIn: false,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const INITIAL_DATA = useInitialUserData()
  const segments = useSegments();
  const inMainGroup = segments[0] === "(main)";

  const fetchUser = async () => {
    if (isLoading || !session || !AuthApp.currentUser)
      return

    // setIsUserLoading(true);
    try {
      const userDocRef = doc(FirestoreDB, "users", AuthApp.currentUser.uid);

      const unsubscribe = onSnapshot(userDocRef, (userSnap) => {
        if (userSnap.exists()) {
          const userData = {
            ...(userSnap.data() as User),
            id: userSnap.id as string,
          };
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          Console.log("User not found");
          if (inMainGroup) {
            signOutUser();
          }
        }
      }, (error) => {
        Console.error(error, "Error fetching user data");
        if (inMainGroup) {
          signOutUser();
        }
      })

      return unsubscribe;
    } catch (error: any) {
      Console.error(error, "User Snapshot catch error");
      if (inMainGroup) {
        signOutUser();
      }
    } finally {
      setIsUserLoading(false);
    }
  };
  const cUser = AuthApp.currentUser

  useEffect(() => {
    if (isLoading)
      return
    AuthApp.authStateReady().then(() => {
      if (!AuthApp.currentUser) {
        setIsUserLoading(false);
        if (inMainGroup) {
          signOutUser();
        }
      } else {
        fetchUser();
      }
    })
  }, [session, isLoading, cUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        AuthApp,
        email,
        password
      );

      setSession(userCredential.user.uid);

      HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST", });

      await Console.analytics("signed_in", {
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
        ...INITIAL_DATA,
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
    setSession(uid);
    HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST" });

    if (collaborationId)
      resetAndNavigate(`/collaboration-details/${collaborationId}`);
    else if ((user?.profile?.completionPercentage || 0) < 60) {
      resetAndNavigate("/profile");
    } else {
      resetAndNavigate("/collaborations");
    }

    if (user?.settings?.accountStatus == AccountStatus.Deactivated) {
      Toaster.success("Your account is successfuly activated")
      updateUser(uid, {
        settings: {
          ...user?.settings,
          accountStatus: AccountStatus.Activated
        }
      })
    } else {
      Toaster.success("Signed In Successfully!");
    }
  };

  const firebaseSignUp = async (uid: string, hasSocials?: number) => {
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
    Console.log("Signing out user", "AuthContextProvider");
    try {
      if (Platform.OS !== "web") {
        // Remove push notification token from the database
        // const newUpdatedTokens = await updatedTokens(user);

        // if (newUpdatedTokens) {
        //   await updateUser(session as string, {
        //     pushNotificationToken: newUpdatedTokens,
        //   });
        // }
      }
    } catch (e: any) {
      Console.error(e, "Issues while removing tokens");
    }

    signOut(AuthApp)
      .then(() => {
        Console.analytics("signed_out", {
          id: user?.id,
          email: user?.email,
        });
        Toaster.success("Signed Out Successfully!");
      }).catch((error) => {
        Console.error(error, "Error signing out");
      }).finally(() => {
        setSession("");
        setIsLoggedIn(false);
        setUser(null);
        resetAndNavigate("/pre-signin");
      })
  };

  const getUser = async (userId: string): Promise<User | null> => {
    const userRef = doc(FirestoreDB, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = {
        ...(userSnap.data() as User),
        id: userSnap.id as string,
      };
      setIsLoggedIn(true);
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
        isLoggedIn,
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
