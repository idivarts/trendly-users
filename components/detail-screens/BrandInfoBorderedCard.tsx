import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import { truncateText } from "@/utils/profile";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Card, Text } from "react-native-paper";

import { useCollaborationDetailSurfaceStyles } from "./useCollaborationDetailSurfaceStyles";

type Props = {
    imageUrl: string;
    name: string;
    verified?: boolean;
    description: string;
    truncateAt?: number;
    descriptionNumberOfLines?: number;
    header?: ReactNode;
    onPressBrand?: () => void;
    /** When true, omit outer Card.Content (e.g. contract layout uses plain View). */
    plainBody?: boolean;
};

const BrandInfoBorderedCard = ({
    imageUrl,
    name,
    verified,
    description,
    truncateAt,
    descriptionNumberOfLines,
    header,
    onPressBrand,
    plainBody,
}: Props) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useCollaborationDetailSurfaceStyles();

    const aboutText =
        truncateAt != null ? truncateText(description, truncateAt) : description;

    const brandBlock = (
        <View style={styles.brandRow}>
            <ImageComponent
                url={imageUrl}
                altText="Brand logo"
                shape="square"
                size="small"
                style={plainBody ? styles.brandImageContractCompact : undefined}
            />
            <View style={styles.brandTextColumn}>
                <Text style={styles.brandTitle}>
                    {name}{" "}
                    {verified ? (
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={colors.primary}
                        />
                    ) : null}
                </Text>
                <Text
                    style={styles.brandSubtitle}
                    numberOfLines={descriptionNumberOfLines}
                    ellipsizeMode="tail"
                >
                    {aboutText}
                </Text>
            </View>
        </View>
    );

    const inner = (
        <>
            {header}
            {onPressBrand ? (
                <Pressable
                    style={styles.pressableBrandArea}
                    onPress={onPressBrand}
                >
                    {brandBlock}
                </Pressable>
            ) : (
                brandBlock
            )}
        </>
    );

    if (plainBody) {
        return <View style={styles.brandCardCompact}>{inner}</View>;
    }

    return (
        <View style={styles.borderedSection}>
            <Card.Content>{inner}</Card.Content>
        </View>
    );
};

export default BrandInfoBorderedCard;
