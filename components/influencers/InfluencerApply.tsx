import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Button, Chip, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { View } from '../theme/Themed'

const InfluencerApplyScreen = () => {
    const [reason, setReason] = useState('')
    const [collabType, setCollabType] = useState<string[]>([])
    const [exampleLinks, setExampleLinks] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [collabMode, setCollabMode] = useState('free')
    const [budgetMin, setBudgetMin] = useState('')
    const [budgetMax, setBudgetMax] = useState('')

    const collabTypes = ['Co-Creation', 'Shoutout Exchange', 'Networking', 'Event Collaboration', 'Product Giveaway', 'Live Sessions']
    const socialPlatforms = ['Instagram', 'YouTube', 'Facebook', 'Twitter', 'Snapchat']

    const handleSubmit = () => {
        // Submit logic here
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>Tell us why you want to collab?</Text>
                <TextInput
                    placeholder="Drop a line or two here"
                    value={reason}
                    onChangeText={setReason}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    error={!reason}
                />
                <HelperText type="error" visible={!reason}>
                    Reason is required
                </HelperText>

                <Text variant="titleMedium" style={{ marginTop: 20 }}>What kind of collab are you thinking?</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {collabTypes.map(type => (
                        <Chip
                            key={type}
                            selected={collabType.includes(type)}
                            onPress={() =>
                                setCollabType(prev =>
                                    prev.includes(type)
                                        ? prev.filter(t => t !== type)
                                        : [...prev, type]
                                )
                            }
                        >
                            {type}
                        </Chip>
                    ))}
                </View>

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Add any example collab links?</Text>
                <TextInput
                    placeholder="Paste your reel or video links here"
                    value={exampleLinks}
                    onChangeText={setExampleLinks}
                    mode="outlined"
                />
                <HelperText type="error" visible={!!exampleLinks && !exampleLinks.startsWith('http')}>
                    Please enter a valid link
                </HelperText>

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Which platform are you planning this collab on?</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {socialPlatforms.map(p => (
                        <Chip
                            key={p}
                            selected={platforms.includes(p)}
                            onPress={() =>
                                setPlatforms(prev =>
                                    prev.includes(p)
                                        ? prev.filter(t => t !== p)
                                        : [...prev, p]
                                )
                            }
                        >
                            {p}
                        </Chip>
                    ))}
                </View>

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Is this a paid or free collab?</Text>
                <SegmentedButtons
                    value={collabMode}
                    onValueChange={setCollabMode}
                    buttons={[
                        { value: 'free', label: 'Free' },
                        { value: 'paid', label: 'Paid' },
                    ]}
                    style={{ marginTop: 10 }}
                />

                {collabMode === 'paid' && (
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <TextInput
                            label="Min Budget"
                            value={budgetMin}
                            onChangeText={setBudgetMin}
                            keyboardType="numeric"
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                        <TextInput
                            label="Max Budget"
                            value={budgetMax}
                            onChangeText={setBudgetMax}
                            keyboardType="numeric"
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                    </View>
                )}
            </ScrollView>
            <View style={{ padding: 16 }}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={!reason || (collabMode === 'paid' && (!budgetMin || !budgetMax))}
                >
                    Submit
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export default InfluencerApplyScreen