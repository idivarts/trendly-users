import { useAuthContext, useSocialContext } from '@/contexts'
import { useBreakpoints } from '@/hooks'
import Colors from '@/shared-uis/constants/Colors'
import { User } from '@/types/User'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Modal, Portal } from 'react-native-paper'

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

    if (!primarySocial) {
        return null; // Ensure primarySocial is available before rendering
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
                    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                        <View style={{ width: '100%', gap: 16 }}>
                            <TouchableOpacity
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
                    </ScrollView>
                )}
            </Modal>
        </Portal>
    )
}

export default InfluencerConnectModal