import ConnnectedSocials from "@/components/basic-profile/connected-socials";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import Toast from "react-native-toast-message";

const ConnnectedSocialsScreen = () => {
    return (
        <AppLayout style={{ flex: 1 }}>
            <View
                style={{
                    zIndex: 5000,
                }}
            >
                <Toast />
            </View>
            <ScreenHeader title="Connected Socials" />
            <ConnnectedSocials />
        </AppLayout>
    );
};

export default ConnnectedSocialsScreen;
