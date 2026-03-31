import { Text, View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import {
    faCheck,
    faCheckCircle,
    faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Linking, StyleSheet } from "react-native";
import { Chip, Modal } from "react-native-paper";

interface BrandModalProps {
    brand: {
        name: string;
        description: string;
        image: string;
        website: string;
        verified: boolean;
        category: string[];
    };
    visible: boolean;
    setVisibility: (visible: boolean) => void;
}

const BrandModal: React.FC<BrandModalProps> = ({
    brand,
    visible,
    setVisibility,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getLinkMessage = (url: string): string => {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;

            if (hostname.includes("instagram.com")) {
                return "Visit Instagram";
            }
            if (hostname.includes("facebook.com")) {
                return "Visit Facebook";
            }
            return "Visit Website";
        } catch {
            return "Visit Website";
        }
    };

    return (
        <Modal
            visible={visible}
            onDismiss={() => setVisibility(false)}
            contentContainerStyle={styles.modalContainer}
        >
            <View style={styles.inner}>
                <ImageComponent
                    url={brand.image}
                    altText="Brand Image"
                    shape="square"
                    style={styles.brandImage}
                />

                <Text style={styles.brandName}>
                    {brand.name}{" "}
                    {brand.verified && (
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={colors.primary}
                            size={22}
                        />
                    )}
                </Text>

                {brand.description && (
                    <Text style={styles.description}>{brand.description}</Text>
                )}

                <View style={styles.chipRow}>
                    {brand.category.map((cat, index) => (
                        <Chip
                            key={index}
                            style={styles.chip}
                            mode="outlined"
                            icon={() => (
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    color={colors.primary}
                                    size={16}
                                />
                            )}
                        >
                            {cat}
                        </Chip>
                    ))}
                </View>

                <Button onPress={() => Linking.openURL(brand.website)}>
                    <Text style={styles.linkButtonLabel}>
                        <FontAwesomeIcon
                            icon={faLink}
                            color={colors.onPrimary}
                            size={16}
                            style={styles.linkIcon}
                        />
                        {getLinkMessage(brand.website)}
                    </Text>
                </Button>
            </View>
        </Modal>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        modalContainer: {
            backgroundColor: c.background,
            borderRadius: 10,
            padding: 20,
            marginHorizontal: 20,
        },
        inner: {
            alignItems: "center",
            gap: 20,
        },
        brandImage: {
            width: 120,
            height: 120,
            borderRadius: 10,
        },
        brandName: {
            fontSize: 24,
            fontWeight: "bold",
            color: c.text,
            textAlign: "center",
        },
        description: {
            fontSize: 16,
            color: c.text,
            textAlign: "center",
        },
        chipRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
        },
        chip: {
            margin: 5,
            alignItems: "center",
        },
        linkButtonLabel: {
            fontSize: 16,
            color: c.onPrimary,
            fontWeight: "bold",
        },
        linkIcon: {
            marginRight: 16,
        },
    });
}

export default BrandModal;
