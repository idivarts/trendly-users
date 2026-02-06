import DrawerMenuContent from "@/components/drawer-layout/DrawerMenuContent";
import { useBreakpoints } from "@/hooks";
import { SocialsProtectedScreen } from "@/layouts/protected";
import CustomDrawerWrapper from "@/shared-uis/components/CustomDrawer";
import { Stack } from "expo-router";

const DrawerLayout = () => {
    const { xl } = useBreakpoints();

    return (
        <SocialsProtectedScreen>
            {/* <Drawer
        backBehavior="history"
        drawerContent={() => <DrawerMenuContent />}
        screenOptions={{
          drawerType: "permanent",
          headerShown: false,
          drawerStyle: {
            display: xl ? 'flex' : 'none', // Hide the drawer on tablet, and mobile screens
          },
          headerLeft: () => xl ? null : <BackButton />,
        }}
      > */}
            <CustomDrawerWrapper DrawerContent={<DrawerMenuContent />} isFixed={false}>
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
            </CustomDrawerWrapper>
            {/* </Drawer> */}
        </SocialsProtectedScreen>
    );
};

export default DrawerLayout;
