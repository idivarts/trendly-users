import Collaboration from "@/components/collaboration";
import { useAuthContext } from "@/contexts";

const CollaborationsScreen = () => {
    const { user } = useAuthContext();
    if (!user) {
        return null; // or a loading spinner, or redirect to login
    }
    return <Collaboration />;
};

export default CollaborationsScreen;
