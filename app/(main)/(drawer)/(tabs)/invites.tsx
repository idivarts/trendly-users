
import Invitations from "@/components/proposals/Invitations";
import { View } from "@/components/theme/Themed";
import TopTabNavigation from "@/components/ui/top-tab-navigation";
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
    component: <Invitations />,
  }
];

const MyInvites = () => {
  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          paddingTop: 16,
        }}
      >
        <TopTabNavigation tabs={tabs} />
      </View>
    </AppLayout>
  );
};

export default MyInvites;
