import VerificationAddressContent from "@/components/verification/VerificationAddressContent";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";

const VerificationAddressScreen = () => {
    return (
        <AppLayout>
            <ScreenHeader title="Current Address" />
            <VerificationAddressContent />
        </AppLayout>
    );
};

export default VerificationAddressScreen;
