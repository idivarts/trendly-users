import { useChatContext } from "@/contexts";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ImageComponent from "@/shared-uis/components/image-component";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import {
    faCircleInfo,
    faStar,
    faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { FC, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import Button from "../ui/button";

interface ActionContainerProps {
    contract: IContracts;
    feedbackModalVisible: () => void;
    showQuotationModal: () => void;
    userData: IUsers;
}

const ActionContainer: FC<ActionContainerProps> = ({
    contract,
    showQuotationModal,
    feedbackModalVisible,
    userData,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [manager, setManager] = useState<IManagers>();
    const { fetchChannelCid } = useChatContext();
    const router = useMyNavigation();

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <>
                {Array.from({ length: fullStars }, (_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        size={16}
                        color={colors.yellow}
                    />
                ))}
                {hasHalfStar && (
                    <FontAwesomeIcon
                        icon={faStarHalfStroke}
                        size={16}
                        color={colors.yellow}
                    />
                )}
            </>
        );
    };

    const fetchManager = async () => {
        if (!contract.feedbackFromBrand?.managerId) return;
        const managerRef = doc(
            FirestoreDB,
            "managers",
            contract.feedbackFromBrand?.managerId
        );
        const managerSnap = await getDoc(managerRef);
        setManager(managerSnap.data() as IManagers);
    };

    useEffect(() => {
        fetchManager();
    }, [contract.feedbackFromBrand?.managerId]);

    const infoBannerStyle =
        contract.status === 3 ? styles.infoBannerComplete : styles.infoBannerActive;

    return (
        <View style={styles.root}>
            {contract.status !== 3 && (
                <View style={styles.actionsRow}>
                    {contract.status === 0 && (
                        <>
                            <Button
                                mode="outlined"
                                style={styles.flexButton}
                                onPress={() => {
                                    try {
                                        Toaster.success(
                                            "Successfully informed brand to start the collaboration"
                                        );
                                        HttpWrapper.fetch(
                                            `/api/collabs/contracts/${contract.streamChannelId}`,
                                            {
                                                method: "POST",
                                            }
                                        ).catch(() => {
                                            Toaster.error("Successfully went wrong!!");
                                        });
                                    } catch (e: unknown) {
                                        Console.error(e);
                                    }
                                }}
                            >
                                Ask to Start Contract
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.flexButton}
                                onPress={showQuotationModal}
                            >
                                Revise Quotation
                            </Button>
                        </>
                    )}
                    {contract.status === 1 && (
                        <>
                            <Button
                                mode="contained-tonal"
                                style={styles.flexButton}
                                onPress={() => {
                                    try {
                                        Toaster.success(
                                            "Successfully informed brand to end the collaboration"
                                        );
                                        HttpWrapper.fetch(
                                            `/api/collabs/contracts/${contract.streamChannelId}/end`,
                                            {
                                                method: "POST",
                                            }
                                        ).catch(() => {
                                            Toaster.error("Something went wrong");
                                        });
                                    } catch (e: unknown) {
                                        Console.error(e);
                                    }
                                }}
                            >
                                Ask to End Contract
                            </Button>
                            <Button
                                mode="contained"
                                style={styles.flexButton}
                                onPress={async () => {
                                    const channelCid = await fetchChannelCid(
                                        contract.streamChannelId
                                    );
                                    router.push(`/channel/${channelCid}`);
                                }}
                            >
                                Go to Messages
                            </Button>
                        </>
                    )}
                    {contract.status === 2 && (
                        <Button
                            mode="contained"
                            style={styles.flexButton}
                            onPress={feedbackModalVisible}
                        >
                            Give Feedback
                        </Button>
                    )}
                </View>
            )}
            {contract.status == 3 && contract.feedbackFromBrand && (
                <View style={styles.feedbackCard}>
                    <View style={styles.starsRow}>
                        {renderStars(contract.feedbackFromBrand.ratings || 0)}
                    </View>
                    <View style={styles.feedbackRow}>
                        <ImageComponent
                            url={manager?.profileImage || ""}
                            shape="circle"
                            altText="Manager Image"
                            initials={manager?.name}
                            style={styles.avatar}
                        />
                        <View style={styles.feedbackTextCol}>
                            <Text style={styles.feedbackTitle}>
                                From Brand ({manager?.name})
                            </Text>
                            <Text style={styles.feedbackBody}>
                                {contract.feedbackFromBrand.feedbackReview}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
            {contract.status == 3 && contract.feedbackFromInfluencer && (
                <View style={styles.feedbackCard}>
                    <View style={styles.starsRow}>
                        {renderStars(contract.feedbackFromInfluencer.ratings || 0)}
                    </View>
                    <View style={styles.feedbackRow}>
                        <ImageComponent
                            url={userData.profileImage || ""}
                            shape="circle"
                            altText="User Image"
                            initials={userData.name}
                            style={styles.avatar}
                        />
                        <View style={styles.feedbackTextCol}>
                            <Text style={styles.feedbackTitle}>
                                From Influencer ({userData.name})
                            </Text>
                            <Text style={styles.feedbackBody}>
                                {contract.feedbackFromInfluencer?.feedbackReview}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
            <View style={[styles.infoBanner, infoBannerStyle]}>
                <FontAwesomeIcon
                    icon={faCircleInfo}
                    size={20}
                    color={colors.text}
                />
                <Text style={styles.infoBannerText}>
                    {contract.status === 0
                        ? "Please make sure you chat with the brands before you ask them to start collaboration."
                        : contract.status === 1
                            ? "Please note, if your collaboration is done, ask the brand to end the collaboration and rate you."
                            : contract.status === 2
                                ? "Feedbacks are important for us. Our platform works on what people give feedback to each other. You see that other persons feedback only if you give your feedback"
                                : "Collaboration has ended! However you can continue to chat with the brand for any future opportunities."}
                </Text>
            </View>
        </View>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        root: {
            width: "100%",
            flex: 1,
            flexDirection: "column",
            gap: 16,
            backgroundColor: "transparent",
        },
        actionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
            backgroundColor: "transparent",
        },
        flexButton: {
            flex: 1,
        },
        feedbackCard: {
            width: "100%",
            borderWidth: 0.3,
            padding: 10,
            borderRadius: 10,
            gap: 10,
            borderColor: c.gray300,
        },
        starsRow: {
            flexDirection: "row",
        },
        feedbackRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flexGrow: 1,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        feedbackTextCol: {
            flex: 1,
        },
        feedbackTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: c.text,
        },
        feedbackBody: {
            fontSize: 16,
            flexWrap: "wrap",
            overflow: "hidden",
            lineHeight: 22,
            color: c.text,
        },
        infoBanner: {
            padding: 16,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        infoBannerActive: {
            backgroundColor: c.yellow,
        },
        infoBannerComplete: {
            backgroundColor: c.green,
        },
        infoBannerText: {
            fontSize: 16,
            flex: 1,
            marginRight: 12,
            color: c.text,
        },
    });
}

export default ActionContainer;
