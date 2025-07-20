import { INFLUENCER_COLLAB_TYPES } from '@/shared-constants/preferences/influencer-collab-types'
import { PLATFORMS } from '@/shared-constants/preferences/platforms'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { View } from '../theme/Themed'
import Select, { SelectItem } from '../ui/select'

const isValidLink = (url: string) => {
    const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
    return pattern.test(url.trim())
}

const InfluencerApplyScreen = () => {
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
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>Tell us why you want to collab?</Text>
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

                <Text variant="titleMedium" style={{ marginTop: 20 }}>What kind of collab are you thinking?</Text>
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

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Add any example collab link?</Text>
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

                <Text variant="titleMedium" style={{ marginTop: 20 }}>Which platform are you planning this collab on?</Text>
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
            </ScrollView>
            <View style={{ padding: 16 }}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={!reason || (!!exampleLinks && !isValidLink(exampleLinks)) || (collabMode === 'paid' && (!budgetMin || !budgetMax))}
                    loading={loading}
                >
                    Submit
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export default InfluencerApplyScreen