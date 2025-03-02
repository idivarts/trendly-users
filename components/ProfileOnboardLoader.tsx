import Colors from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
// import LottieView from 'lottie-react-native';

const messages = [
    "Setting things up...",
    "Almost there...",
    "Getting everything ready...",
    "Finalizing...",
    "Just a moment...",
];

const ProfileOnboardLoader = () => {
    const theme = useTheme();
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 4000); // Change text every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                backgroundColor: Colors(theme).background,
                padding: 20,
            }}
        >
            {/* Lottie Animation */}
            {/* <LottieView
                source={require('@/assets/animations/loading.json')} // Use your own animation file
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
            /> */}
            {/* <Image /> */}
            {/* GIF Loader */}
            <Image
                source={require('@/assets/images/loader-gif1.gif')} // Local GIF file
                style={{ width: 300, height: 300 }}
                resizeMode="contain"
            />

            {/* Progress Message */}
            <Text style={{ color: Colors(theme).text, fontSize: 16, marginTop: 20, textAlign: "center" }}>
                {messages[messageIndex]}
            </Text>

            {/* Fallback Activity Indicator */}
            <ActivityIndicator size="large" color={Colors(theme).text} style={{ marginTop: 20 }} />

        </View>
    );
}

export default ProfileOnboardLoader;