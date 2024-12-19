import { FirestoreDB } from "@/utils/firestore";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuthContext } from "./auth-context.provider";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { useStorageState } from "@/hooks";
import { router } from "expo-router";

interface SocialContextProps {
  socials: ISocials[];
  primarySocial: ISocials | null;
  setPrimarySocial: (social: ISocials) => void;
  isFetchingSocials: boolean;
}

const SocialContext = createContext<SocialContextProps>({
  socials: [],
  primarySocial: null,
  isFetchingSocials: false,
  setPrimarySocial: (social: ISocials) => {},
});

export const SocialContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user, session, isLoading } = useAuthContext();
  const [socials, setSocials] = useState<any[]>([]);
  const [primarySocial, setPrimarySocial] = useState<ISocials | null>(null);
  const [isFetchingSocials, setIsFetchingSocials] = useState(false);

  const fetchSocials = () => {
    if (!user || !user.id || isFetchingSocials) return;

    setIsFetchingSocials(true);

    try {
      const socialProfileRef = collection(
        FirestoreDB,
        "users",
        user.id,
        "socials"
      );

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(socialProfileRef, (snapshot) => {
        const socialData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            ...(data.isInstagram
              ? { instaProfile: data.instaProfile }
              : { fbProfile: data.fbProfile }),
          };
        });

        setSocials(socialData);

        if (user.primarySocial) {
          const primary = socialData.find(
            //@ts-ignore
            (social: ISocials) => social.id === user.primarySocial
          );
          //@ts-ignore
          setPrimarySocial(primary || null);
        }

        if (socialData.length === 0) {
          router.replace("/no-social-connected");
        }

        if (!user.primarySocial && socialData.length > 0) {
          router.replace("/primary-social-select");
        }

        if (user.primarySocial && socialData.length > 0) {
          const primary = socialData.find(
            //@ts-ignore
            (social: ISocials) => social.id === user.primarySocial
          );
          if (!primary) router.replace("/primary-social-select");
          //@ts-ignore
          setPrimarySocial(primary || null);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up socials snapshot:", error);
    } finally {
      setIsFetchingSocials(false);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user && user.id && !isLoading) {
      unsubscribe = fetchSocials();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <SocialContext.Provider
      value={{
        socials,
        primarySocial,
        isFetchingSocials,
        setPrimarySocial,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocialContext = () => useContext(SocialContext);
