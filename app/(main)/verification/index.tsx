import VerificationPanContent from "@/components/verification/VerificationPanContent";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";

const VerificationPANScreen = () => {
    return (
        <AppLayout>
            <ScreenHeader title="Influencer Verification" />
            <VerificationPanContent />
        </AppLayout>
    );
};

export default VerificationPANScreen;
