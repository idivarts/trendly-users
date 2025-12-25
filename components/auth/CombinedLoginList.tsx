import React from 'react'
import { Platform } from 'react-native'
import AppleLogin from './AppleLogin'
import GoogleLogin from './GoogleLogin'

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
            {/* We wont be collecting social information while login/signup */}
            {/* {IS_BETA_ENABLED &&
                <FacebookLogin setLoading={setLoading} setError={setError} />}
            {IS_BETA_ENABLED &&
                <InstagramLogin setLoading={setLoading} setError={setError} />} */}
        </>
    )
}

export default CombinedLoginList