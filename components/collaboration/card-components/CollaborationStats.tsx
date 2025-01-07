import { Text, View } from "@/components/theme/Themed";
import { stylesFn } from "@/styles/CollaborationCardStats.styles";
import { useTheme } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";

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
    const fetchApplied = await getDocs(appliedRef);
    const docsData = fetchApplied.docs.map((doc) => doc.data());
    setAppliedCount(docsData.length);
  };

  useEffect(() => {
    fetchAppliedCount();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 16,
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
            ? `$${props.budget.min}`
            : `$${props.budget.min} - $${props.budget.max}`}
        </Text>
        <Text style={styles.infoText}>
          Brand Hire Rate: {props.brandHireRate || 75}%
        </Text>
      </View>
    </View>
  );
};

export default CollaborationStats;
