import { AWSContextProvider, BrandContextProvider, ChatContextProvider, CloudMessagingContextProvider, CollaborationContextProvider, ContractContextProvider, FirebaseStorageContextProvider, NotificationContextProvider, SocialContextProvider } from "@/contexts";
import { Stack } from "expo-router";

const MainLayout = () => {
  return (
    <ChatContextProvider>
      <SocialContextProvider>
        <AWSContextProvider>
          <FirebaseStorageContextProvider>
            <BrandContextProvider>
              <CollaborationContextProvider>
                <ContractContextProvider>
                  <NotificationContextProvider>
                    <CloudMessagingContextProvider>
                      <Stack
                        screenOptions={{
                          animation: "ios",
                          headerShown: false,
                        }}
                      >
                        <Stack.Screen
                          name="(onboarding)"
                          options={{
                            headerShown: false,
                          }}
                        />

                        <Stack.Screen
                          name="(drawer)"
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
                    </CloudMessagingContextProvider>
                  </NotificationContextProvider>
                </ContractContextProvider>
              </CollaborationContextProvider>
            </BrandContextProvider>
          </FirebaseStorageContextProvider>
        </AWSContextProvider>
      </SocialContextProvider>
    </ChatContextProvider>
  );
};

export default MainLayout;
