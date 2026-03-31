import { View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const DetailScreenCenteredLoader = () => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                },
            }),
        []
    );

    return (
        <View style={styles.root}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

export default DetailScreenCenteredLoader;
