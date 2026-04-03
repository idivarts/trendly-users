import { KYCFlowProvider } from "@/contexts";
import { Stack } from "expo-router";

const VerificationLayout = () => {
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
