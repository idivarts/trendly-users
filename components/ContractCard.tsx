import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/CollaborationCard.styles";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

interface CollaborationAdCardProps {
    collaborationName: string;
    brandName: string;
    cost: string;
    status: {
        sent: boolean;
        active: boolean;
        approvalPending: boolean;
        changesRequested: boolean;
        done: boolean;
        prematureEnd: boolean;
        archived: boolean;
    };
    id: string;
    onOpenBottomSheet: (id: string) => void;
}

const ContractCard = (props: CollaborationAdCardProps) => {
    const router = useMyNavigation();
    const theme = useTheme();
    const styles = stylesFn(theme);

    return (
        <Card
            style={styles.card}
            onPress={() => {
                router.push(`/collaboration-details/${props.id}`);
            }}
        >
            <Card.Content>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.collabName}>{props.collaborationName}</Text>
                        <Text style={styles.brandName}>{props.brandName}</Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                props.onOpenBottomSheet(props.id);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsis}
                                size={24}
                                color={Colors(theme).text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Posted Date and Cost */}
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>Cost: {props.cost}</Text>
                </View>

                {/* Payment Verified, Promotion and Collaboration Type */}
                <View style={styles.chipRow}>
                    <Chip>
                        Active: {props.status.active.toString()}
                    </Chip>
                    <Chip>
                        Approval: {props.status.approvalPending ? "Pending" : "Approved"}
                    </Chip>
                </View>
            </Card.Content>
        </Card>
    );
};

export default ContractCard;
