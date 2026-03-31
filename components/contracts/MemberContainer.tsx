import { useAuthContext, useChatContext } from "@/contexts";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { FC, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "../theme/Themed";
import MembersCard from "./members-card";

interface MemberContainerProps {
    channelId: string;
    setMembersFromBrand: (members: any[]) => void;
}

const MemberContainer: FC<MemberContainerProps> = ({
    channelId,
    setMembersFromBrand,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { fetchMembers, isChatConnected } = useChatContext();
    const { user } = useAuthContext();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMembersFromClient = async () => {
        try {
            setLoading(true);
            const memberList = await fetchMembers(channelId);

            const memberData = await Promise.all(
                memberList.map(async (member: { user: { id: string } }) => {
                    const memberRef = doc(FirestoreDB, "managers", member.user.id);
                    const memberDoc = await getDoc(memberRef);
                    const data = memberDoc.data();
                    const row = {
                        ...data,
                        email: data?.email,
                        managerId: member.user.id,
                    };
                    if (row && row.email) {
                        return row;
                    }
                    return null;
                })
            );
            const validMembers = memberData.filter((data) => data !== null);

            setMembers(validMembers);
            setMembersFromBrand(validMembers);
        } catch (e) {
            Console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isChatConnected) fetchMembersFromClient();
    }, [user?.id, isChatConnected]);

    return (
        <View style={styles.root}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Members</Text>
            </View>
            {loading && (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            )}
            <View style={styles.listCol}>
                {members.map((m: { managerId?: string }, i: number) => (
                    <MembersCard key={m?.managerId || i} manager={m} />
                ))}
            </View>
        </View>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        root: {
            width: "100%",
            flexDirection: "column",
            gap: 16,
            backgroundColor: "transparent",
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "bold",
            color: c.text,
        },
        loadingWrap: {
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        },
        listCol: {
            flexDirection: "column",
            gap: 10,
            backgroundColor: "transparent",
        },
    });
}

export default MemberContainer;
