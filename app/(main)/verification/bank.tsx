import VerificationBankContent from "@/components/verification/VerificationBankContent";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";

const VerificationBankScreen = () => {
    return (
        <AppLayout>
            <ScreenHeader title="Bank Details" />
            <VerificationBankContent />
        </AppLayout>
    );
};

export default VerificationBankScreen;
