import VerificationAgreementContent from "@/components/verification/VerificationAgreementContent";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";

const VerificationAgreementScreen = () => {
    return (
        <AppLayout>
            <ScreenHeader title="Agreement" />
            <VerificationAgreementContent />
        </AppLayout>
    );
};

export default VerificationAgreementScreen;
