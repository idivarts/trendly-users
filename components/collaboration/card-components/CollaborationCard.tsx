import { ICollaboration } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Carousel from "@/shared-uis/components/carousel/carousel";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { FC, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";

import CollaborationDetails from "./CollaborationDetails";
import CollaborationHeader from "./CollaborationHeader";
import CollaborationStats from "./CollaborationStats";
import { View } from "@/components/theme/Themed";

export interface CollaborationCardItem extends ICollaboration {
    id: string;
    brandName: string;
    brandImage?: string;
    paymentVerified?: boolean;
    brandHireRate?: string;
}

interface CollaborationCardProps {
    item: CollaborationCardItem;
    carouselWidth: number;
    onOpenBottomSheet: (collabId: string) => void;
}

const CollaborationCard: FC<CollaborationCardProps> = ({
    item,
    carouselWidth,
    onOpenBottomSheet,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const router = useMyNavigation();

    return (
        <View style={styles.card}>
            <CollaborationHeader
                cardId={item.id}
                cardType="collaboration"
                brand={{
                    image: item.brandImage || "",
                    name: item.brandName,
                    paymentVerified: item.paymentVerified || false,
                }}
                collaboration={{
                    collabId: item.id,
                    collabName: item.name,
                    timePosted: item.timeStamp,
                }}
                onOpenBottomSheet={onOpenBottomSheet}
            />

            {item.attachments && item.attachments.length > 0 && (
                <Carousel
                    theme={theme}
                    parentId={item.id}
                    onImagePress={() => {
                        router.push({
                            // @ts-ignore
                            pathname: `/collaboration-details/${item.id}`,
                            params: {
                                cardType: "collaboration",
                            },
                        });
                    }}
                    data={
                        item.attachments?.map((attachment: any) =>
                            processRawAttachment(attachment)
                        ) || []
                    }
                    carouselWidth={carouselWidth}
                />
            )}

            <Pressable
                onPress={() => {
                    router.push({
                        // @ts-ignore
                        pathname: `/collaboration-details/${item.id}`,
                        params: {
                            cardType: "collaboration",
                        },
                    });
                }}
            >
                <CollaborationDetails
                    collaborationDetails={{
                        collabDescription: item.description || "",
                        promotionType: item.promotionType,
                        location: item.location,
                        platform: item.platform,
                        contentType: item.contentFormat,
                    }}
                />
                <CollaborationStats
                    influencerCount={item.numberOfInfluencersNeeded}
                    collabID={item.id}
                    budget={item.budget ? item.budget : { min: 0, max: 0 }}
                    brandHireRate={item.brandHireRate || ""}
                />
            </Pressable>
        </View>
    );
};

export default CollaborationCard;

const createStyles = (colors: ReturnType<typeof Colors>) =>
    StyleSheet.create({
        card: {
            width: "100%",
            borderWidth: 0.3,
            borderColor: colors.gray300,
            gap: 8,
            borderRadius: 5,
            paddingBottom: 16,
            overflow: "hidden",
        },
    });

