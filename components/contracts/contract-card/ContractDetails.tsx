import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { FC, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/theme/Themed";

interface ContractDetailsProps {
    application: IApplications;
    collabDetails: string;
}

const ContractDetails: FC<ContractDetailsProps> = ({
    application,
    collabDetails,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    return (
        <View style={styles.container}>
            <View style={styles.detailsRow}>
                <Text
                    style={styles.detailsText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {collabDetails}
                </Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                    Quote: {application?.quotation || "Free"}
                </Text>
                {/* <Text
          style={{
            fontSize: 16,
            color: Colors(theme).text,
          }}
        >
          Timeline: {new Date(application.timeline).toLocaleDateString()}
        </Text> */}
            </View>
        </View>
    );
};

export default ContractDetails;

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
            gap: 16,
        },
        detailsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
        },
        detailsText: {
            fontSize: 16,
            color: colors.text,
            flex: 1,
        },
        metaRow: {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
        },
        metaText: {
            fontSize: 16,
            color: colors.text,
        },
    });
}
