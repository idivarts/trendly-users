import { useAuthContext, useSocialContext } from '@/contexts'
import { useBreakpoints } from '@/hooks'
import { useMyNavigation } from '@/shared-libs/utils/router'
import { useConfirmationModel } from '@/shared-uis/components/ConfirmationModal'
import Colors from '@/shared-uis/constants/Colors'
import { User } from '@/types/User'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'
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
    const { openModal } = useConfirmationModel()
    const router = useMyNavigation()

    const { xl } = useBreakpoints()

    const [scaleAnim] = useState(new Animated.Value(0.7))

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
            tension: 100,
        }).start()
    }, [])

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
        // Toaster.error("Complete your profile!", "Need atleast 60% profile completion to connect with influencers.");
        openModal({
            title: "Profile Incomplete",
            description: "Please complete your profile to a minimum of 60% to connect with influencers.",
            confirmText: "Go to Profile",
            confirmAction: () => {
                router.push("/edit-profile")
            }
        })
        onClose();
        return null;
    }
    if (!(user?.profile?.content?.influencerConectionGoals)) {
        // Toaster.error("Influencer Connection Goal Missing!", "Need to update influencer Connection Goal to be able to connect.");
        openModal({
            title: "Connection Goal Missing",
            description: "Please update your influencer connection goal to connect with influencers.",
            confirmText: "Update Goal",
            confirmAction: () => {
                router.push("/edit-profile")
            }
        })
        onClose();
        return null;
    }

    return (
        <Portal>
            <Modal
                visible={true}
                onDismiss={onClose}
                dismissable={true}
                contentContainerStyle={{ backgroundColor: 'transparent' }}
            >
                <Animated.View
                    style={[
                        {
                            backgroundColor: Colors(theme).card,
                            margin: 20,
                            borderRadius: 8,
                            padding: 20,
                            transform: [{ scale: scaleAnim }],
                        },
                        xl && {
                            width: 600,
                            alignSelf: "center",
                        }
                    ]}
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
                </Animated.View>
            </Modal>
        </Portal>
    )
}

export default InfluencerConnectModal