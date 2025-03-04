import AppLayout from '@/layouts/app-layout';
import Toaster from '@/shared-uis/components/toaster/Toaster';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Beta = () => {
    const [isBetaOpted, setIsBetaOpted] = useState(localStorage.getItem("v2") === "true");

    const handleBetaOptIn = () => {
        localStorage.setItem("v2", "true");
        setIsBetaOpted(true);
        Toaster.success("Opted in Beta")
        window.location.href = "/pre-signin"
        // resetAndNavigate("/pre-signin")
    };

    const handleBetaOptOut = () => {
        localStorage.removeItem("v2");
        Toaster.info("You are removed from Beta Program")
        setIsBetaOpted(false);
        window.location.href = "/pre-signin"
        // resetAndNavigate("/pre-signin")
    };

    return (
        <AppLayout>
            <View style={styles.container}>
                <Text style={styles.title}>Join Our Beta Testing Program</Text>
                <Text style={styles.description}>
                    Be among the first to experience new features! You can opt-in to try the latest updates or opt-out anytime.
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.optInButton]}
                        onPress={handleBetaOptIn}
                    // disabled={isBetaOpted}
                    >
                        <Text style={styles.buttonText}>
                            {'Opt-in for Beta'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.optOutButton]}
                        onPress={handleBetaOptOut}
                    // disabled={!isBetaOpted}
                    >
                        <Text style={styles.buttonText}>
                            {'Opt-out of Beta'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
    },
    optInButton: {
        backgroundColor: '#4CAF50',
    },
    optOutButton: {
        backgroundColor: '#FF5252',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Beta;