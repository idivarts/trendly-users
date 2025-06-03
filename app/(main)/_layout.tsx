import { AWSContextProvider, BrandContextProvider, ChatContextProvider, CollaborationContextProvider, ContractContextProvider, FirebaseStorageContextProvider, NotificationContextProvider, SocialContextProvider, useAuthContext } from "@/contexts";
import { streamClient } from "@/contexts/chat-context.provider";
import { CloudMessagingContextProvider } from "@/shared-libs/contexts/cloud-messaging.provider";
import { ScrollProvider } from "@/shared-libs/contexts/scroll-context";
import TrackingProvider from "@/shared-libs/contexts/tracking-provider";
import { Stack } from "expo-router";

const MainLayout = () => {
  const { user, updateUser } = useAuthContext()
  return (
    <TrackingProvider>
      <SocialContextProvider>
        <AWSContextProvider>
          <FirebaseStorageContextProvider>
            <BrandContextProvider>
              <CollaborationContextProvider>
                <ContractContextProvider>
                  <NotificationContextProvider>
                    <CloudMessagingContextProvider streamClient={streamClient} userOrmanager={user} updateUserOrManager={updateUser}>
                      <ChatContextProvider>
                        <ScrollProvider>
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
                        </ScrollProvider>
                      </ChatContextProvider>
                    </CloudMessagingContextProvider>
                  </NotificationContextProvider>
                </ContractContextProvider>
              </CollaborationContextProvider>
            </BrandContextProvider>
          </FirebaseStorageContextProvider>
        </AWSContextProvider>
      </SocialContextProvider>
    </TrackingProvider>
  );
};

export default MainLayout;
