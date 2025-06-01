import { useAppleLogin } from '@/hooks/requests/use-apple-login'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import SocialButton from '../ui/button/social-button'

interface IProps {
    setLoading: Function
    setError: Function
}
const AppleLogin = ({ setLoading, setError }: IProps) => {
    const { appleLogin, isAppleAvailable } = useAppleLogin(setLoading, setError)
    if (!isAppleAvailable)
        return null;

    return (
        <SocialButton
            icon={faApple}
            label="Continue with Apple"
            onPress={appleLogin}
        />
    )
}

export default AppleLogin