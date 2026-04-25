
import ContractsTabContent from "@/components/contracts/contracts-tab-content";
import { View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import TopTabNavigation from "@/components/ui/top-tab-navigation";
import AppLayout from "@/layouts/app-layout";

const tabs = [
    {
        id: "Active",
        title: "Active",
        component: <ContractsTabContent scope="active" key="active-contracts" />,
    },
    {
        id: "Past",
        title: "Past",
        component: <ContractsTabContent scope="past" key="past-contracts" />,
    },
];

const MyActivity = () => {
    return (
        <AppLayout>
            <ScreenHeader title="Contracts" />
            <View
                style={{
                    flex: 1,
                    // paddingTop: 16,
                }}
            >
                <TopTabNavigation tabs={tabs} />
            </View>
        </AppLayout>
    );
};

export default MyActivity;
