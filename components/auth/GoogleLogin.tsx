import { useGoogleLogin } from '@/hooks/requests/use-google-login'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import SocialButton from '../ui/button/social-button'

interface IProps {
    setLoading: Function
    setError: Function
}
const GoogleLogin = ({ setLoading, setError }: IProps) => {
    const { googleLogin } = useGoogleLogin(setLoading, setError)
    return (
        <SocialButton
            icon={faGoogle}
            label="Continue with Google"
            onPress={googleLogin}
        />
    )
}

export default GoogleLogin