import { Text, View } from "@/components/theme/Themed";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { stylesFn } from "@/styles/CollaborationCardStats.styles";
import { useTheme } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
;

interface CollaborationStatsProps {
    influencerCount: number;
    collabID: string;
    budget: {
        max?: number;
        min?: number;
    };
    brandHireRate: string;
}

const CollaborationStats: FC<CollaborationStatsProps> = (
    props: CollaborationStatsProps
) => {
    const [appliedCount, setAppliedCount] = useState<number>(0);
    const theme = useTheme();
    const styles = stylesFn(theme);

    const fetchAppliedCount = async () => {
        const appliedRef = collection(
            FirestoreDB,
            "collaborations",
            props.collabID,
            "applications"
        );
        const appLength = (await getDocs(appliedRef)).size;
        // const docsData = fetchApplied.docs.map((doc) => doc.data());
        setAppliedCount(appLength);
    };

    useEffect(() => {
        fetchAppliedCount();
    }, []);

    return (
        <View
            style={{
                paddingHorizontal: 16,
                paddingTop: 8
            }}
        >
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                    Influencers Needed: {props.influencerCount}
                </Text>
                <Text style={styles.infoText}>Applied: {appliedCount || 0}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                    Budget:{" "}
                    {props.budget.min === props.budget.max
                        ? `Rs. ${props.budget.min}`
                        : `Rs. ${props.budget.min} - Rs. ${props.budget.max}`}
                </Text>
                <Text style={styles.infoText}>
                    Brand Hire Rate: {props.brandHireRate || 75}%
                </Text>
            </View>
        </View>
    );
};

export default CollaborationStats;
