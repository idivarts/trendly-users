import InfluencerApplyScreen from '@/components/influencers/InfluencerApply'
import ScreenHeader from '@/components/ui/screen-header'
import AppLayout from '@/layouts/app-layout'
import React from 'react'

const InfluencerApply = () => {
    return (
        <AppLayout >
            <ScreenHeader title='Invite Influencer' />
            <InfluencerApplyScreen />
        </AppLayout>
    )
}

export default InfluencerApply