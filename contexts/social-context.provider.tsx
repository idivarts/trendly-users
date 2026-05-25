import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { usePathname } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type PropsWithChildren,
} from "react";
import { useAuthContext } from "./auth-context.provider";

// ─── ISocialAccount mirrors the backend SocialAccount struct (social_v2.go) ──
export interface ISocialAccount {
    id: string;
    platform: "instagram" | "facebook" | "youtube" | "linkedin" | "twitter";
    userId: string;
    username: string;
    displayName: string;
    profileImageURL: string;
    bio?: string;
    profileURL?: string;
    followerCount: number;
    followingCount: number;
    mediaCount: number;
    connectedAt: number;
    updatedAt: number;
    rawProfile?: Record<string, unknown>;
}

interface SocialContextProps {
    socials: ISocialAccount[];
    primarySocial: ISocialAccount | null;
    setPrimarySocial: (social: ISocialAccount) => void;
    isFetchingSocials: boolean;
    refreshSocials: () => void;
}

const SocialContext = createContext<SocialContextProps>({
    socials: [],
    primarySocial: null,
    isFetchingSocials: false,
    setPrimarySocial: () => { },
    refreshSocials: () => { },
});

export const SocialContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const { user } = useAuthContext();
    const [socials, setSocials] = useState<ISocialAccount[]>([]);
    const [primarySocial, setPrimarySocial] = useState<ISocialAccount | null>(null);
    const [isFetchingSocials, setIsFetchingSocials] = useState(true);
    const { replace, resetAndNavigate } = useMyNavigation();
    const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

    const pathname = usePathname();
    const allowedPaths = [
        "/no-social-connected",
    ];

    const fetchSocials = () => {
        if (!user || !user.id) return;

        // Tear down any previous listener before creating a new one
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        try {
            const socialAccountsRef = collection(
                FirestoreDB,
                "users",
                user.id,
                "socialAccounts"
            );

            const unsubscribe = onSnapshot(socialAccountsRef, (snapshot) => {
                const socialData = snapshot.docs.map((doc) => ({
                    ...(doc.data() as ISocialAccount),
                    id: doc.id,
                }));

                setSocials(socialData);

                Console.log("Pathname", pathname);

                if (socialData.length === 0) {
                    if (!allowedPaths.includes(pathname)) {
                        replace("/no-social-connected");
                    }
                    return;
                }

                const primary = user.primarySocial
                    ? socialData.find((s) => s.id === user.primarySocial) ?? null
                    : null;

                if (!primary) {
                    setPrimarySocial(null);
                    resetAndNavigate("/primary-social-select");
                } else {
                    setPrimarySocial(primary);

                    if (allowedPaths.includes(pathname)) {
                        resetAndNavigate("/questions");
                    }
                }
            });

            unsubscribeRef.current = unsubscribe;
            return unsubscribe;
        } catch (error) {
            Console.error(error, "Error setting up socialAccounts snapshot:");
        } finally {
            setIsFetchingSocials(false);
        }
    };

    // Force a re-subscription (useful after a deep-link callback)
    const refreshSocials = () => {
        fetchSocials();
    };

    useEffect(() => {
        if (user && user.id) {
            const unsubscribe = fetchSocials();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [user]);

    return (
        <SocialContext.Provider
            value={{
                socials,
                primarySocial,
                isFetchingSocials,
                setPrimarySocial,
                refreshSocials,
            }}
        >
            {children}
        </SocialContext.Provider>
    );
};

export const useSocialContext = () => useContext(SocialContext);
