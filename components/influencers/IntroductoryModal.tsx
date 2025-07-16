import useBreakpoints from '@/shared-libs/utils/use-breakpoints'
import { Text, View } from '@/shared-uis/components/theme/Themed'
import Colors from '@/shared-uis/constants/Colors'
import { useTheme } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { Animated, Image, ScrollView } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import Button from '../ui/button'

type IntroductoryModalProps = {
    isOpen: boolean
    onClose: () => void
}

const IntroductoryModal: React.FC<IntroductoryModalProps> = ({ isOpen, onClose }) => {
    const theme = useTheme()
    const { xl } = useBreakpoints()

    const scaleAnim = useRef(new Animated.Value(0.8)).current

    useEffect(() => {
        if (isOpen) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 6,
                tension: 80,
            }).start()
        } else {
            scaleAnim.setValue(0.8)
        }
    }, [isOpen])

    return (
        <Portal>
            <Modal
                visible={isOpen}
                onDismiss={onClose}
                contentContainerStyle={[{
                    backgroundColor: Colors(theme).card,
                    margin: 20,
                    borderRadius: 8,
                    padding: 20,
                }, xl && {
                    alignSelf: "center"
                }]}
            >
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Image
                            source={require("@/assets/images/no-socials.png")}
                            style={{ width: 250, height: 250, marginBottom: 20, borderRadius: 8 }}
                            resizeMode="contain"
                        />
                        <Text style={{ alignSelf: 'stretch', marginTop: 18, marginBottom: 10, fontSize: 22 }}>
                            Connect with Influencers!
                        </Text>
                        <Text style={{ alignSelf: 'stretch', marginBottom: 10, fontSize: 16 }}>
                            Use this section to connect with your fellow influencers
                        </Text>
                        <View style={{ alignSelf: 'stretch', paddingTop: 16 }}>
                            <Text>{'\u2022'} Easily discover brand collaborations</Text>
                            <Text>{'\u2022'} Apply with just a tap</Text>
                            <Text>{'\u2022'} Track your earnings and collaborations</Text>
                            <Text>{'\u2022'} Get verified to increase visibility</Text>
                        </View>
                        <Button mode="contained" onPress={onClose} style={{ marginTop: 20 }}>
                            Understood
                        </Button>
                    </Animated.View>
                </ScrollView>
            </Modal>
        </Portal>
    )
}

export default IntroductoryModal