import { Text, View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { FC, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

interface MembersCardProps {
    manager: any;
}

const MembersCard: FC<MembersCardProps> = ({ manager }) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    if (!manager) {
        return null;
    }

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Avatar.Image size={40} source={imageUrl(manager.profileImage)} />
                <View>
                    <Text style={styles.name}>{manager.name}</Text>
                    <Text style={styles.email}>{manager.email}</Text>
                </View>
            </View>
        </View>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        card: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderWidth: 0.3,
            borderColor: c.gray300,
            borderRadius: 10,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        name: {
            fontSize: 16,
            color: c.text,
        },
        email: {
            fontSize: 16,
            color: c.textSecondary,
        },
    });
}

export default MembersCard;
