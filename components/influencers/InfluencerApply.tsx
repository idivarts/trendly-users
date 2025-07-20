import { INFLUENCER_COLLAB_TYPES } from '@/shared-constants/preferences/influencer-collab-types'
import { PLATFORMS } from '@/shared-constants/preferences/platforms'
import Colors from '@/shared-uis/constants/Colors'
import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { View } from '../theme/Themed'
import Button from '../ui/button'
import Select, { SelectItem } from '../ui/select'

const isValidLink = (url: string) => {
    const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
    return pattern.test(url.trim())
}

const InfluencerApplyScreen = () => {
    const theme = useTheme()

    const [reason, setReason] = useState('')
    const [collabType, setCollabType] = useState<SelectItem[]>([])
    const [exampleLinks, setExampleLinks] = useState('')
    const [platforms, setPlatforms] = useState<SelectItem[]>([])
    const [collabMode, setCollabMode] = useState('free')
    const [budgetMin, setBudgetMin] = useState('')
    const [budgetMax, setBudgetMax] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
        setSubmitted(true)
        setLoading(true)
        try {
            // Submit logic here
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text variant="titleMedium" style={{ marginBottom: 8, color: Colors(theme).text }}>Tell us why you want to collab?</Text>
                <TextInput
                    autoFocus
                    placeholder="Drop a line or two here"
                    value={reason}
                    onChangeText={setReason}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    error={submitted && !reason}
                />
                <HelperText type="error" visible={submitted && !reason}>
                    Reason is required
                </HelperText>

                <Text variant="titleMedium" style={{ marginTop: 0, color: Colors(theme).text }}>What kind of collab are you thinking?</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    <Select
                        items={INFLUENCER_COLLAB_TYPES.map(v => ({ label: v, value: v }))}
                        selectItemIcon={true}
                        value={collabType}
                        multiselect
                        onSelect={(data) => {
                            setCollabType(data)
                        }}
                    />
                    {/* {collabTypes.map(type => (
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
                    ))} */}
                </View>

                <Text variant="titleMedium" style={{ marginTop: 20, color: Colors(theme).text }}>Are you willing to pay for Collab?</Text>
                <SegmentedButtons
                    value={collabMode}
                    onValueChange={setCollabMode}
                    buttons={[
                        {
                            value: 'free',
                            label: 'Free',
                            style: { backgroundColor: collabMode === 'free' ? Colors(theme).primary : undefined },
                            labelStyle: { color: collabMode === 'free' ? Colors(theme).white : Colors(theme).text },
                        },
                        {
                            value: 'paid',
                            label: 'Paid',
                            style: { backgroundColor: collabMode === 'paid' ? Colors(theme).primary : undefined },
                            labelStyle: { color: collabMode === 'paid' ? Colors(theme).white : Colors(theme).text },
                        },
                    ]}
                    style={{ marginTop: 10 }}
                />
                {collabMode === 'paid' && (
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <TextInput
                            label="Min Budget (Rs)"
                            value={budgetMin}
                            onChangeText={setBudgetMin}
                            keyboardType="numeric"
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                        <TextInput
                            label="Max Budget (Rs)"
                            value={budgetMax}
                            onChangeText={setBudgetMax}
                            keyboardType="numeric"
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                    </View>
                )}
                <Text variant="bodySmall" style={{ marginTop: 8, color: Colors(theme).textSecondary }}>
                    Most influencers don’t work for free—adding a budget makes your offer more compelling and shows you’re serious.
                </Text>

                <View style={{ marginBottom: 30, marginTop: 50 }}>
                    <Text variant="titleSmall" style={{ color: Colors(theme).textSecondary, textAlign: 'center' }}>
                        Optional items below
                    </Text>
                    <Text variant="bodySmall" style={{ color: Colors(theme).textSecondary, textAlign: 'center', marginTop: 4 }}>
                        Filling these out increases your chances of getting your invite accepted
                    </Text>
                </View>

                <Text variant="titleMedium" style={{ marginTop: 0, color: Colors(theme).text }}>Add any example collab link?</Text>
                <TextInput
                    placeholder="Paste your reel or video links here"
                    value={exampleLinks}
                    onChangeText={setExampleLinks}
                    mode="outlined"
                    error={!!exampleLinks && !isValidLink(exampleLinks)}
                />
                <HelperText type="error" visible={!!exampleLinks && !isValidLink(exampleLinks)}>
                    Please enter a valid link
                </HelperText>

                <Text variant="titleMedium" style={{ marginTop: 0, color: Colors(theme).text }}>Which platform are you planning this collab on?</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    <Select
                        items={PLATFORMS.map(v => ({ label: v, value: v }))}
                        selectItemIcon={true}
                        value={platforms}
                        multiselect
                        onSelect={(data) => {
                            setPlatforms(data)
                        }}
                    />
                    {/* {socialPlatforms.map(p => (
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
                    ))} */}
                </View>


            </ScrollView>
            <View style={{ padding: 16 }}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={!reason || (!!exampleLinks && !isValidLink(exampleLinks)) || (collabMode === 'paid' && (!budgetMin || !budgetMax) || collabType.length === 0)}
                    loading={loading}
                >
                    Submit
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export default InfluencerApplyScreen