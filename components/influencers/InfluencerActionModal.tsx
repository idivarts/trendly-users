import { useAuthContext } from '@/contexts';
import { CREATORS_FE_URL } from '@/shared-constants/app';
import BottomSheetContainer from '@/shared-uis/components/bottom-sheet';
import { useConfirmationModel } from '@/shared-uis/components/ConfirmationModal';
import Toaster from '@/shared-uis/components/toaster/Toaster';
import * as Clipboard from "expo-clipboard";
import React from 'react';
import { List } from 'react-native-paper';

interface IProps {
    influencerId: string | undefined,
    isModalVisible: boolean, toggleModal: () => void, openProfile: Function,
}

const InfluencerActionModal: React.FC<IProps> = ({ influencerId, isModalVisible, toggleModal, openProfile }) => {
    const { user, updateUser } = useAuthContext()
    const { openModal } = useConfirmationModel()
    const blockInfluencer = async () => {
        if (!user?.id || !influencerId)
            return;
        const blockedInfluencers = new Set(user.moderations?.blockedInfluencers || [])
        blockedInfluencers.add(influencerId)
        await updateUser(user?.id, {
            ...user,
            moderations: {
                ...user.moderations,
                blockedInfluencers: [...blockedInfluencers]
            }
        })
        Toaster.success("Successfully Blocked")
    }
    const reportAndBlockInfluencer = async () => {
        if (!user?.id || !influencerId)
            return;
        const blockedInfluencers = new Set(user.moderations?.blockedInfluencers || [])
        const reportedInfluencers = new Set(user.moderations?.reportedInfluencers || [])
        blockedInfluencers.add(influencerId)
        reportedInfluencers.add(influencerId)
        await updateUser(user?.id, {
            ...user,
            moderations: {
                ...user.moderations,
                blockedInfluencers: [...blockedInfluencers],
                reportedInfluencers: [...reportedInfluencers]
            }
        })
        Toaster.success("Successfully Reported and Blocked")
    }

    return (
        <>
            {isModalVisible && (
                <BottomSheetContainer
                    isVisible={isModalVisible}
                    snapPoints={["35%", "50%"]}
                    onClose={toggleModal}
                >
                    <List.Section style={{ paddingBottom: 28 }}>
                        <List.Item
                            title="View Profile"
                            onPress={() => {
                                // bottomSheetModalRef.current?.present();
                                openProfile()
                                toggleModal();
                            }}
                        />
                        <List.Item
                            title="Copy Influencer Profile"
                            onPress={async () => {
                                // bottomSheetModalRef.current?.present();
                                await Clipboard.setStringAsync(
                                    `${CREATORS_FE_URL}/influencers?influencerId=${influencerId}`
                                );
                                Toaster.success("Copied the Influencer Profile on Clipboard")
                                toggleModal();
                            }}
                        />
                        {/* <List.Item title="Send Message" onPress={() => null} /> */}
                        <List.Item title="Report and Block Influencer" onPress={() => {
                            openModal({
                                title: "Report and Block User",
                                description: "Are you sure you want to report and block this user? You wont be seeing any of their activities. We will review this report within 24 hours",
                                confirmText: "Report and Block",
                                confirmAction: reportAndBlockInfluencer
                            })
                            toggleModal()
                        }} />
                        <List.Item title="Block Influencer" onPress={() => {
                            openModal({
                                title: "Block user?",
                                description: "Are you sure you want to block this user? You wont be seeing any of their activities.",
                                confirmText: "Block",
                                confirmAction: blockInfluencer
                            })
                            toggleModal()
                        }} />

                    </List.Section>
                </BottomSheetContainer>
            )}
        </>
    )
}

export default InfluencerActionModal