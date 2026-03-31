import { View } from '@/components/theme/Themed'
import EmptyState from '@/components/ui/empty-state'
import { useAuthContext } from '@/contexts'
import { useMyNavigation } from '@/shared-libs/utils/router'
import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
    const { user } = useAuthContext()
    const router = useMyNavigation()

    if ((user?.profile?.completionPercentage || 0) < 60) {
        return <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >

            <EmptyState
                action={() => router.push("/profile")}
                actionLabel="Complete Profile Now"
                image={require("@/assets/images/incomplete-profile.png")}
                subtitle={"For better applications we only allow influencers with more than 60% profile-completion to apply on the collaborations"}
                title="Your Profile is incomplete!"
            />
        </View>
    }
    return (
        <Stack
            screenOptions={{

                headerShown: false,
            }}
        >
        </Stack>
    )
}

export default _layout