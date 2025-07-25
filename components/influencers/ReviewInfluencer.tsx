import AppLayout from "@/layouts/app-layout";
import { User } from "@/types/User";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
// import InfluencerCard from "../InfluencerCard";
import { Text, View } from "../theme/Themed";


import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";

import { useAuthContext } from "@/contexts";
import { InfluencerInvite } from "@/shared-libs/firestore/trendly-pro/models/influencerInvites";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc } from "firebase/firestore";
import { ActivityIndicator, Button } from "react-native-paper";
import ScreenHeader from "../ui/screen-header";

const ReviewInfluencerComponent = () => {
    const [loading, setLoading] = useState(true);
    const [influencer, setInfluencer] = useState<User | null>(null);
    const [invite, setInvite] = useState<InfluencerInvite | null>(null)
    const router = useMyNavigation()
    const { user } = useAuthContext()
    const theme = useTheme();
    const [acceptLoading, setAcceptLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)



    const getInfluencer = async (influencerId: string) => {
        try {
            const influencerRef = doc(collection(FirestoreDB, "users"), influencerId);
            const influencerDoc = await getDoc(influencerRef)
            const influencer: User = {
                ...influencerDoc.data() as IUsers,
                id: influencerDoc.id
            }
            setInfluencer(influencer)

            const infId = influencerId as string || user?.id || ""
            const uId = userId as string || user?.id || ""

            const inviteRef = doc(collection(FirestoreDB, "users", uId, "invitations"), infId);
            const inviteDoc = await getDoc(inviteRef)
            const invite: InfluencerInvite = inviteDoc.data() as InfluencerInvite
            setInvite(invite)
        } finally {
            setLoading(false);
        }
    }

    const { influencerId, userId } = useLocalSearchParams()

    useEffect(() => {
        if (!user)
            return;
        if (!influencerId)
            return;
        getInfluencer(influencerId as string)
    }, [user, influencerId])

    useEffect(() => {
        if (!user)
            return;
        if (!userId)
            return;
        getInfluencer(userId as string)
    }, [user, userId])


    const handleInviteAction = (accept: boolean, influencerId: string) => {
        if (accept) {
            setAcceptLoading(true)
            HttpWrapper.fetch(`/api/influencers/invite/${influencerId}/accept`, {
                method: "POST",
            }).then((res) => {
                Toaster.success("Invitation Accepted")
                router.resetAndNavigate(`/messages`)
            }).catch((err) => {
                Console.error(err, "Error accepting invite")
                Toaster.error("Failed to accept invite", "Please try again later.")
            }).finally(() => {
                setAcceptLoading(false)
            })
        } else {
            setRejectLoading(true)
            HttpWrapper.fetch(`/api/influencers/invite/${influencerId}/reject`, {
                method: "POST",
                body: JSON.stringify({
                    reason: "Not interested in this collaboration"
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res) => {
                Toaster.success("Invitation Rejected")
            }).catch((err) => {
                Console.error(err, "Error rejecting invite")
                Toaster.error("Failed to reject invite", "Please try again later.")
            }).finally(() => {
                setRejectLoading(false)
            })
        }
    }


    if (loading) {
        return (
            <AppLayout>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator />
                </View>
            </AppLayout>
        );
    }

    return (
        <>
            <ScreenHeader title="Review Influencer" />
            <View
                style={{
                    flex: 1,
                    marginHorizontal: "auto",
                    width: "100%", //xl ? MAX_WIDTH_WEB :
                }}
            >
                <ProfileBottomSheet
                    influencer={influencer as User}
                    theme={theme}
                    showCampaignGoals={false}
                    showInfluencerGoals={true}
                    actionCard={
                        <View
                            style={{
                                backgroundColor: Colors(theme).transparent,
                                marginHorizontal: 16,
                                paddingVertical: 16,
                                gap: 16,
                            }}
                        >
                            <Text style={{ paddingVertical: 16 }}>
                                {invite?.reason}
                            </Text>
                            <Button mode="contained" onPress={() => {
                                handleInviteAction(true, invite?.influencerId || "");
                            }} loading={acceptLoading} disabled={rejectLoading}>Accept Invite</Button>
                            <Button mode="outlined" onPress={() => {
                                handleInviteAction(false, invite?.influencerId || "");
                            }} loading={rejectLoading} disabled={acceptLoading}>Reject Invite</Button>

                        </View>
                    }
                    FireStoreDB={FirestoreDB}
                    isBrandsApp={true}
                />
            </View>

            {/* <InfluencerActionModal influencerId={selectedInfluencer?.id} isModalVisible={isModalVisible} toggleModal={ToggleModal} /> */}
        </>
    );
};

export default ReviewInfluencerComponent;
