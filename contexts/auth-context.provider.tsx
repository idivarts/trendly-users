import { useStorageState } from "@/hooks";
import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { useRouter } from "expo-router";
import { AuthApp } from "@/utils/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface AuthContextProps {
  isLoading: boolean;
  session?: string | null;
  signIn: () => void;
  signOut: () => void;
  signUp: (
    email: string,
    password: string
  ) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoading: false,
  session: null,
  signIn: () => null,
  signOut: () => null,
  signUp: (
    email: string,
    password: string
  ) => null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [[isLoading, session], setSession] = useStorageState("id");
  const router = useRouter();

  const signIn = async () => {
    setSession('123');
    // For existing users, redirect to the main screen.
    router.replace("/one");
    Toaster.success("Signed In Successfully!");
  };

  const signUp = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(AuthApp, email, password);
      if (response.user) {
        // For non-existing users, redirect to the onboarding screen.
        setSession('123');
        router.replace("/onboard");
        Toaster.success("Signed Up Successfully!");
      }
    } catch (error) {
      Toaster.error("Failed to sign up.");
    }
  };

  const signOut = () => {
    setSession("");
    router.replace("/login");
    Toaster.success("Signed Out Successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
