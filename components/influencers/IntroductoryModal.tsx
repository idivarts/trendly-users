import useBreakpoints from '@/shared-libs/utils/use-breakpoints'
import { Text, View } from '@/shared-uis/components/theme/Themed'
import Colors from '@/shared-uis/constants/Colors'
import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Image, ScrollView } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import Button from '../ui/button'

type IntroductoryModalProps = {
    isOpen: boolean
    onClose: () => void
}

const IntroductoryModal: React.FC<IntroductoryModalProps> = ({ isOpen, onClose }) => {
    const theme = useTheme()
    const { xl } = useBreakpoints()

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
                    alignSelf: "center"
                }, xl && {
                    width: 600,
                }]}
            >
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
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
                </ScrollView>
                <Button mode="contained" onPress={onClose} style={{ marginTop: 20 }}>
                    Understood
                </Button>
            </Modal>
        </Portal>
    )
}

export default IntroductoryModal