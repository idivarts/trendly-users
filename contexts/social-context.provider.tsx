import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { FirestoreDB } from "@/utils/firestore";
import { usePathname, useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuthContext } from "./auth-context.provider";

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
  setPrimarySocial: (social: ISocials) => { },
});

export const SocialContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user } = useAuthContext();
  const [socials, setSocials] = useState<any[]>([]);
  const [primarySocial, setPrimarySocial] = useState<ISocials | null>(null);
  const [isFetchingSocials, setIsFetchingSocials] = useState(true);

  const { replace } = useRouter();

  const pathname = usePathname();
  const allowedPaths = [
    "/no-social-connected",
    "/add-instagram-manual",
  ];

  const fetchSocials = () => {
    if (!user || !user.id) {
      // setIsFetchingSocials(false);
      return;
    };

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

        console.log("Pathname", pathname);

        if (allowedPaths.includes(pathname)) {
          return
        }

        if (socialData.length === 0) {
          replace("/no-social-connected");
          return;
        }

        const primary = user.primarySocial
          // @ts-ignore
          ? socialData.find((social: ISocials) => social.id === user.primarySocial)
          : null;

        // console.log("Firebase Sign --> Social data", socialData, user.primarySocial, primary);

        if (!primary) {
          setPrimarySocial(null);
          replace("/primary-social-select");
        } else {
          // @ts-ignore
          setPrimarySocial(primary);
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

    if (user && user.id) {
      // setIsFetchingSocials(true);
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
