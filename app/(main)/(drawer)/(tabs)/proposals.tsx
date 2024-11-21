import { View } from "@/components/theme/Themed";
import AppLayout from "@/layouts/app-layout";
import Applications from "@/components/proposals/Applications";
import Invitations from "@/components/proposals/Invitations";
import TopTabNavigation from "@/components/ui/top-tab-navigation";

const tabs = [
  {
    id: "Applications",
    title: "Applications",
    component: <Applications />,
  },
  {
    id: "Invitations",
    title: "Invitations",
    component: <Invitations />,
  },
];

const ProposalScreen = () => {
  return (
    <AppLayout>
      <View
        style={{
          flex: 1,
          paddingTop: 16,
        }}
      >
        <TopTabNavigation
          tabs={tabs}
        />
      </View>
    </AppLayout>
  );
};

export default ProposalScreen;
