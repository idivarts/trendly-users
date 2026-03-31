import { SocialsProtectedScreen } from "@/layouts/protected";
import { Stack } from "expo-router";

const DrawerLayout = () => {
    return (
        <SocialsProtectedScreen>
            <Stack screenOptions={{

                headerShown: false
            }}>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(screens)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </SocialsProtectedScreen>
    );
};

export default DrawerLayout;
