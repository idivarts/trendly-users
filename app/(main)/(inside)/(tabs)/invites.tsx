import InfluencerInvitations from "@/components/proposals/InfluencerInvitations";
import Invitations from "@/components/proposals/Invitations";
import { View } from "@/components/theme/Themed";
import TopTabNavigation from "@/components/ui/top-tab-navigation";
import { useBreakpoints } from "@/hooks";
import { useFloatingTabChromePad } from "@/hooks/use-floating-tab-chrome-pad";
import AppLayout from "@/layouts/app-layout";

const tabs = [
    {
        id: "brand-invites",
        title: "Brand Invites",
        component: <Invitations />,
    },
    {
        id: "influencer-invites",
        title: "Influencer Invites",
        component: <InfluencerInvitations />,
    }
];

const MyInvites = () => {
    const { xl } = useBreakpoints();
    const tabChrome = useFloatingTabChromePad();

    return (
        <AppLayout>
            <View
                style={{
                    flex: 1,
                    paddingTop: xl ? 16 : tabChrome.top,
                    paddingBottom: xl ? 0 : tabChrome.bottom,
                }}
            >
                <TopTabNavigation tabs={tabs} />
            </View>
        </AppLayout>
    );
};

export default MyInvites;
