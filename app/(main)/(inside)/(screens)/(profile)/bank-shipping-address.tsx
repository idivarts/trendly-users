import BankShippingAddressContent from "@/components/profile/BankShippingAddressContent";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";

const BankAndShippingScreen = () => {
    const { user } = useAuthContext();
    if (!user) {
        return null;
    }

    return (
        <AppLayout>
            <ScreenHeader title="Bank and Shipping Address" />
            <BankShippingAddressContent />
        </AppLayout>
    );
};

export default BankAndShippingScreen;
