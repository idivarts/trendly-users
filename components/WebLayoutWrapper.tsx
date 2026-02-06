import React from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';

// Mobile width constraint (Savana uses around 430px or similar for its mobile-locked view)
const MOBILE_MAX_WIDTH = 450;

interface WebLayoutWrapperProps {
    children: React.ReactNode;
}

/**
 * WebLayoutWrapper
 * 
 * On Web Desktop: Constrains the app to a centered mobile-width viewport.
 * On Web Mobile & Native: Renders children normally (full width).
 */
const WebLayoutWrapper: React.FC<WebLayoutWrapperProps> = ({ children }) => {
    // We only apply the centering wrapper on Web.
    // On native platforms, we just return the children.
    if (Platform.OS !== 'web') {
        return <>{children}</>;
    }

    return (
        <View style={styles.outerContainer as ViewStyle}>
            <View style={styles.webAppContainer as ViewStyle}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA', // Very light neutral background
        alignItems: 'center',
        justifyContent: 'center',
        // @ts-ignore - web only
        height: Platform.OS === 'web' ? '100vh' : '100%',
        width: '100%',
    },
    webAppContainer: {
        width: '100%',
        maxWidth: MOBILE_MAX_WIDTH,
        // @ts-ignore - web only
        height: Platform.OS === 'web' ? '100vh' : '100%',
        backgroundColor: '#fff',
        // Professional shadow for device look on desktop
        ...Platform.select({
            web: {
                boxShadow: '0 0 40px rgba(0,0,0,0.05)',
                borderLeft: '1px solid #eee',
                borderRight: '1px solid #eee',
            } as any,
        }),
        overflow: 'hidden',
    },
});

export default WebLayoutWrapper;
