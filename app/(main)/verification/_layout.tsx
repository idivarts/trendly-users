import { KYCFlowProvider, useAuthContext } from "@/contexts";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { userHasPhoneForKyc } from "@/utils/profile";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

const VerificationLayout = () => {
    const { user, isUserLoading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (isUserLoading) return;
        if (!user) return;
        if (!userHasPhoneForKyc(user)) {
            Toaster.error(
                "Add your phone number in Edit profile before verification."
            );
            router.replace("/profile");
        }
    }, [isUserLoading, user, router]);

    if (!isUserLoading && user && !userHasPhoneForKyc(user)) {
        return null;
    }

    return (
        <KYCFlowProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </KYCFlowProvider>
    );
};

export default VerificationLayout;
