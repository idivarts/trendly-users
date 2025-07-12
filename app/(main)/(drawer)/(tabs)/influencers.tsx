import ExploreInfluencers from "@/components/influencers/ExploreInfluencers";
import Applications from "@/components/proposals/Applications";
import Invitations from "@/components/proposals/Invitations";
import { useAuthContext } from "@/contexts";
import { ActivityIndicator } from "react-native";

const tabs = [
  {
    id: "Invitations",
    title: "Invitations",
    component: <Invitations />,
  },
  {
    id: "Applications",
    title: "Applications",
    component: <Applications />,
  },
];

const ProposalScreen = () => {
  const { user } = useAuthContext()
  if (!user)
    return <ActivityIndicator />
  return <ExploreInfluencers />
};

export default ProposalScreen;
