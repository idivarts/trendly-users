
import Applications from "@/components/proposals/Applications";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";


const MyApplications = () => {
    return (
        <AppLayout>
            <ScreenHeader title="My Applications" />
            <View
                style={{
                    flex: 1,
                }}
            >
                <Applications />
            </View>
        </AppLayout>
    );
};

export default MyApplications;
