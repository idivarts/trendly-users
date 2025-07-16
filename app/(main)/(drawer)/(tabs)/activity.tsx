
import ActiveContracts from "@/components/contracts/active";
import Applications from "@/components/proposals/Applications";
import Invitations from "@/components/proposals/Invitations";
import { View } from "@/components/theme/Themed";
import TopTabNavigation from "@/components/ui/top-tab-navigation";
import AppLayout from "@/layouts/app-layout";

const tabs = [
  {
    id: "Invitations",
    title: "Invitations",
    component: <Invitations />,
  },
  {
    id: "Contracts",
    title: "Contracts",
    component: <ActiveContracts />,
  },
  {
    id: "Applications",
    title: "Applications",
    component: <Applications />,
  }
  // {
  //   id: "Past",
  //   title: "Past",
  //   component: <PastContracts />,
  // },
];

const MyActivity = () => {
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

export default MyActivity;
