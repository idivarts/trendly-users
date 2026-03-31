import ExploreInfluencers from "@/components/influencers/ExploreInfluencers";
import { useAuthContext } from "@/contexts";
import { ActivityIndicator } from "react-native";

const ProposalScreen = () => {
    const { user } = useAuthContext()
    if (!user)
        return <ActivityIndicator />
    return <ExploreInfluencers />
};

export default ProposalScreen;
