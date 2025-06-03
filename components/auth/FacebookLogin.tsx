import { useInitialUserData } from '@/constants/User'
import { useFacebookLogin } from '@/hooks/requests'
import { AuthApp } from '@/shared-libs/utils/firebase/auth'
import { FirestoreDB } from '@/shared-libs/utils/firebase/firestore'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import SocialButton from '../ui/button/social-button'

interface IProps {
    setLoading: Function | any
    setError: Function | any
}
const FacebookLogin = ({ setLoading, setError }: IProps) => {
    const INITIAL_DATA = useInitialUserData();
    const { facebookLogin } = useFacebookLogin(
        AuthApp,
        FirestoreDB,
        INITIAL_DATA,
        setLoading,
        setError)
    return (
        <SocialButton
            icon={faFacebook}
            label="Login with Facebook"
            onPress={facebookLogin}
        />
    )
}

export default FacebookLogin