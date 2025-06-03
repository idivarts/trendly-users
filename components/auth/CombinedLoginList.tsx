import { IS_BETA_ENABLED } from '@/constants/App'
import React from 'react'
import { Platform } from 'react-native'
import AppleLogin from './AppleLogin'
import FacebookLogin from './FacebookLogin'
import GoogleLogin from './GoogleLogin'
import InstagramLogin from './InstagramLogin'

interface IProps {
    setLoading: Function | any
    setError: Function | any
}

const CombinedLoginList = ({ setLoading, setError }: IProps) => {
    return (
        <>
            {Platform.OS != "ios" &&
                <GoogleLogin setLoading={setLoading} setError={setError} />}
            {(Platform.OS == "ios") &&
                <AppleLogin setLoading={setLoading} setError={setError} />}
            {IS_BETA_ENABLED &&
                <FacebookLogin setLoading={setLoading} setError={setError} />}
            {IS_BETA_ENABLED &&
                <InstagramLogin setLoading={setLoading} setError={setError} />}
        </>
    )
}

export default CombinedLoginList