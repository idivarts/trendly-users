import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { usePathname } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuthContext } from "./auth-context.provider";
;

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
  const { replace, resetAndNavigate } = useMyNavigation()

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
          const social: ISocials = {
            ...data as ISocials,
          };
          return social;
        });

        setSocials(socialData);

        Console.log("Pathname", pathname);

        if (socialData.length === 0) {
          if (!allowedPaths.includes(pathname))
            replace("/no-social-connected");
          return;
        }

        // It comes here if social is more than one and it can be on any path

        const primary = user.primarySocial
          // @ts-ignore
          ? socialData.find((social: ISocials) => social.id === user.primarySocial)
          : null;

        if (!primary) {
          setPrimarySocial(null);
          resetAndNavigate("/primary-social-select");
        } else if (primary.isInstagram && !primary.instaProfile?.approxMetrics) {
          // If primary social is Instagram and it doesn't have approxMetrics, take user to Instagram onboarding
          resetAndNavigate(`/add-instagram-manual?socialId=${primary.id}`);
        } else {
          // @ts-ignore
          setPrimarySocial(primary);

          // If user is stagnant on onboard page when social already exists, take users to Onboarding questions page
          if (allowedPaths.includes(pathname)) {
            resetAndNavigate("/questions")
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      Console.error(error, "Error setting up socials snapshot:");
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
