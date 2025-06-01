import { useInitialUserData } from '@/constants/User'
import { useInstagramLogin } from '@/hooks/requests'
import { AuthApp } from '@/shared-libs/utils/firebase/auth'
import { FirestoreDB } from '@/shared-libs/utils/firebase/firestore'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import SocialButton from '../ui/button/social-button'

interface IProps {
    setLoading: Function | any
    setError: Function | any
}
const InstagramLogin = ({ setLoading, setError }: IProps) => {
    const INITIAL_DATA = useInitialUserData();
    const { instagramLogin } = useInstagramLogin(
        AuthApp,
        FirestoreDB,
        INITIAL_DATA,
        setLoading,
        setError)
    return (
        <SocialButton
            icon={faInstagram}
            label="Login with Instagram"
            onPress={instagramLogin}
        />
    )
}

export default InstagramLogin