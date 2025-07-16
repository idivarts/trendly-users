import { useAuthContext, useSocialContext } from '@/contexts'
import { useBreakpoints } from '@/hooks'
import Toaster from '@/shared-uis/components/toaster/Toaster'
import Colors from '@/shared-uis/constants/Colors'
import { User } from '@/types/User'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Modal, Portal } from 'react-native-paper'
import { Text } from '../theme/Themed'

interface IProps {
    influencer: User
    onClose: () => void
}

const InfluencerConnectModal: React.FC<IProps> = ({ influencer, onClose }) => {
    const theme = useTheme()
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const { primarySocial } = useSocialContext()

    const { xl } = useBreakpoints()

    const inviteToCollab = (category: number) => {
        onClose()

        if (category == 0) {

        } else if (category == 1) {

        }
    }

    if (!primarySocial) {
        onClose();
        return null; // Ensure primarySocial is available before rendering
    }

    if ((user?.profile?.completionPercentage || 0) < 60) {
        Toaster.error("Complete your profile!", "Need atleast 60% profile completion to connect with influencers.");
        onClose();
        return null;
    }
    if (!(user?.profile?.content?.influencerConectionGoals)) {
        Toaster.error("Influencer Connection Goal Missing!", "Need to update influencer Connection Goal to be able to connect.");
        onClose();
        return null;
    }

    return (
        <Portal>
            <Modal
                visible={true}
                onDismiss={onClose}
                contentContainerStyle={[{
                    backgroundColor: Colors(theme).card,
                    margin: 20,
                    borderRadius: 8,
                    padding: 20,
                }, xl && {
                    width: 600,
                    alignSelf: "center"
                }]}
            >
                {loading && <ActivityIndicator size={"small"} />}
                {!loading && (
                    <View style={{ width: '100%', gap: 16 }}>
                        <TouchableOpacity
                            onPress={() => inviteToCollab(0)}
                            style={{
                                padding: 20,
                                backgroundColor: Colors(theme).primary,
                                borderRadius: 10,
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome name="handshake-o" size={28} color={Colors(theme).white} style={{ marginBottom: 10 }} />
                            <Text style={{ color: Colors(theme).white, fontSize: 18, fontWeight: 'bold' }}>Connect to Co-Create</Text>
                            <Text style={{ color: Colors(theme).white, fontSize: 14, textAlign: 'center', marginTop: 6 }}>
                                Team up with fellow creators to collaborate on content or exchange shoutouts.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => inviteToCollab(1)}
                            style={{
                                padding: 20,
                                backgroundColor: Colors(theme).primary,
                                borderRadius: 10,
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome name="users" size={28} color={Colors(theme).white} style={{ marginBottom: 10 }} />
                            <Text style={{ color: Colors(theme).white, fontSize: 18, fontWeight: 'bold' }}>Connect for Networking</Text>
                            <Text style={{ color: Colors(theme).white, fontSize: 14, textAlign: 'center', marginTop: 6 }}>
                                Meet like-minded creators.
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Modal>
        </Portal>
    )
}

export default InfluencerConnectModal