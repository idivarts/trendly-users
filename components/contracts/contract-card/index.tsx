import CollaborationHeader from "@/components/collaboration/card-components/CollaborationHeader";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import ContractDetails from "./ContractDetails";
import type { ICollaborationCard } from "./types";

export type { ICollaborationCard } from "./types";

export interface ContractCardRowProps {
    item: ICollaborationCard;
}

const ContractCardRow = ({ item }: ContractCardRowProps) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const router = useMyNavigation();
    const styles = useMemo(() => createRowStyles(colors), [colors]);

    return (
        <Pressable
            onPress={() => {
                router.push(`/contract-details/${item.streamChannelId}`);
            }}
            style={styles.pressable}
        >
            <CollaborationHeader
                brand={{
                    image: item.brandData.image || "",
                    name: item.brandData.name,
                    paymentVerified:
                        item.brandData.paymentMethodVerified || false,
                }}
                cardId={item.streamChannelId}
                cardType="contract"
                collaboration={{
                    //@ts-ignore
                    collabId: item.collaborationData.id,
                    collabName: item.collaborationData.name,
                    timePosted: item.contractTimestamp.startedOn,
                }}
                onOpenBottomSheet={() => {}}
            />
            <ContractDetails
                application={
                    item.applications[0] || {
                        message: "No message",
                        quotation: "No quotation",
                    }
                }
                collabDetails={item.collaborationData.description || ""}
            />
        </Pressable>
    );
};

function createRowStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        pressable: {
            flex: 1,
            borderWidth: 0.3,
            borderColor: colors.gray300,
            borderRadius: 5,
            overflow: "hidden",
        },
    });
}

export default ContractCardRow;
