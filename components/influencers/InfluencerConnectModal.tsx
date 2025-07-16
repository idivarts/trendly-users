import { useAuthContext, useSocialContext } from '@/contexts'
import { useBreakpoints } from '@/hooks'
import Toaster from '@/shared-uis/components/toaster/Toaster'
import Colors from '@/shared-uis/constants/Colors'
import { User } from '@/types/User'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Button, Modal, Portal, TextInput } from 'react-native-paper'
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

    const [isTyping, setIsTyping] = useState(false)
    const [message, setMessage] = useState('')

    const postInvitation = async () => {
        setLoading(false)
        onClose()
        Toaster.success("Influencer Invited successfully!")
    }
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
                    <View style={{ width: '100%', gap: 16 }}>
                        {!isTyping ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => setIsTyping(true)}
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
                                    onPress={() => setIsTyping(true)}
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
                            </>
                        ) : (
                            <KeyboardAvoidingView style={{ width: '100%' }} behavior="padding">
                                <TextInput
                                    autoFocus
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Tell the influencer why you want to connect..."
                                    textAlignVertical="top"
                                    style={{
                                        textAlignVertical: 'top',
                                        minHeight: 120,
                                        width: '100%',
                                        marginBottom: 16,
                                    }}
                                />
                                <Button
                                    mode='contained'
                                    onPress={() => {
                                        postInvitation();
                                        Keyboard.dismiss();
                                    }}>Done</Button>
                            </KeyboardAvoidingView>
                        )}
                    </View>
                )}
            </Modal>
        </Portal>
    )
}

export default InfluencerConnectModal