import { Text, View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import ContentWrapper from "@/components/ui/content-wrapper";
import Select from "@/components/ui/select";
import SelectGroup from "@/components/ui/select/select-group";
import TextInput from "@/components/ui/text-input";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import useEditProfile from "@/hooks/use-edit-profile";
import { CONTENT_NICHE } from "@/shared-constants/preferences/content-niche";
import { CITIES, POPULAR_CITIES } from "@/shared-constants/preferences/locations";
import { TIME_COMMITMENTS } from "@/shared-constants/preferences/time-commitment";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { SingleSelectExtendable } from "@/shared-uis/components/singleselect-extendable";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/edit-profile/EditProfile.styles";
import { includeSingleSelectedItem } from "@/utils/items-list";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Animated, Keyboard, Platform } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import DragAndDropGrid from "../../../shared-libs/functional-uis/grid/DragAndDropGrid";
import ContentItem from "./ContentItem";
import Wrapper from "./wrapper";

interface EditProfileProps {
    unsavedChanges?: boolean;
    setUnsavedChanges?: React.Dispatch<React.SetStateAction<boolean>>;
}

// interface IProfileSubject {
//   action: "unsaved" | "profile",
//   data: any
// }
// export const EditProfileSubject = new Subject<IProfileSubject>()

const EditProfile: React.FC<EditProfileProps> = ({
    unsavedChanges,
    setUnsavedChanges,
}) => {
    const [keyboardHeight] = useState(new Animated.Value(0));
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const theme = useTheme();
    const styles = stylesFn(theme);

    const router = useMyNavigation();

    const {
        xl,
    } = useBreakpoints();

    const {
        contents, email, isProcessing, name, niches, phoneNumber, timeCommitment, user,
        handleNicheSelect, handleSave, setEmail, setName, setPhoneNumber, setTimeCommitment,
        location, setLocation
    } = useEditProfile({
        unsavedChanges,
        setUnsavedChanges,
    });

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                Animated.timing(keyboardHeight, {
                    toValue: e.endCoordinates.height,
                    duration: 250,
                    useNativeDriver: false,
                }).start();
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                Animated.timing(keyboardHeight, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                }).start();
            }
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    if (!user) {
        <View style={{ display: "flex", alignItems: "center" }}>
            <ActivityIndicator size={"large"} />
        </View>
    }
    const { updateUser } = useAuthContext()
    const canEditEmail = AuthApp.currentUser?.providerData[0].providerId == "google.com" || (AuthApp.currentUser?.providerData[0].providerId == "apple.com" && !!user?.email);

    return (
        <View
            style={{
                flex: 1,
                position: 'relative',
                maxWidth: xl ? 768 : '100%',
                marginHorizontal: xl ? 'auto' : 0,
            }}
        >
            <Wrapper>
                <DragAndDropGrid attachments={user?.profile?.attachments || []}
                    onAttachmentChange={(attachments) => {
                        if (user) {
                            updateUser(user.id, {
                                profile: {
                                    ...user.profile,
                                    attachments: attachments
                                }
                            })
                        }
                    }} />
                <View
                    style={styles.inputsContainer}
                >
                    <View
                        style={{
                            gap: 24,
                        }}
                    >
                        <TextInput
                            label="Name"
                            value={name}
                            onChangeText={(name) => {
                                setName(name);
                                setUnsavedChanges && setUnsavedChanges(true);
                            }}
                        />
                        <View
                            style={styles.inputContainer}
                        >
                            <TextInput
                                autoCapitalize="none"
                                style={{
                                    flex: 1,
                                }}
                                label="Email"
                                value={email}
                                disabled={canEditEmail}
                                onChangeText={(email) => {
                                    if (canEditEmail)
                                        return;
                                    setEmail(email);
                                    setUnsavedChanges && setUnsavedChanges(true);
                                }}
                            />
                            {/* {
                user?.emailVerified ? (
                  <VerifiedIcon
                    width={24}
                    height={24}
                    style={{
                      marginTop: 6,
                    }}
                  />
                ) : (
                  <Button
                    mode="contained"
                    size="small"
                    style={{
                      marginTop: 6,
                    }}
                    onPress={() => {
                      if (!user?.emailVerified) verifyEmail()
                    }}
                  >
                    {user?.emailVerified ? 'Verified' : 'Verify'}
                  </Button>
                )
              } */}
                        </View>
                        <View
                            style={styles.inputContainer}
                        >
                            <TextInput
                                style={{
                                    flex: 1,
                                }}
                                label="Phone number"
                                value={phoneNumber}
                                onChangeText={(phoneNumber) => {
                                    setPhoneNumber(phoneNumber);
                                    setUnsavedChanges && setUnsavedChanges(true);
                                }}
                            />
                            {/* <Button
                mode="contained"
                size="small"
                style={{
                  marginTop: 6,
                }}
                onPress={() => null}
              >
                {user?.phoneVerified ? 'Verified' : 'Verify'}
              </Button> */}
                        </View>
                    </View>
                    <View
                        style={{
                            gap: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            Time Commitment
                        </Text>
                        <SelectGroup
                            items={TIME_COMMITMENTS.map(v => ({ label: v, value: v }))}
                            selectedItem={timeCommitment}
                            onValueChange={(value) => {
                                setTimeCommitment(value);
                                setUnsavedChanges && setUnsavedChanges(true);
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
                            }}
                        >
                            Type of influencer you are -{"\n"}
                            Full time - Your complete focus is as a influencer only{"\n"}
                            Part time - You are working somewhere else alongside content creation{"\n"}
                            Hobby - You do influencing just as a hobby.
                        </Text>
                    </View>
                    <View
                        style={{
                            gap: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            Content Niche / Category
                        </Text>
                        <Select
                            items={CONTENT_NICHE.map(v => ({ label: v, value: v }))}
                            selectItemIcon={true}
                            value={niches}
                            multiselect
                            onSelect={handleNicheSelect}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
                            }}
                        >
                            This would help us understand what type of content you create and also better match with brands
                        </Text>
                    </View>
                    <ContentWrapper
                        title="Your Location"
                        description="This would help us match you with brands that are looking for influencers in your area."
                    >
                        <SingleSelectExtendable
                            buttonLabel="View All Locations"
                            initialItemsList={includeSingleSelectedItem(
                                CITIES,
                                location
                            )}
                            initialSelectItemsList={includeSingleSelectedItem(
                                POPULAR_CITIES,
                                location
                            )}
                            onSelectedItemsChange={(value) => {
                                setUnsavedChanges && setUnsavedChanges(true);
                                if (!value) return;
                                setLocation(value);
                            }}
                            selectedItem={user?.location || ""}
                            theme={theme}
                        />
                    </ContentWrapper>
                    <View
                        style={{
                            gap: 32,
                        }}
                    >
                        {
                            contents.map((item) => (
                                <ContentItem
                                    key={item.title}
                                    empty={!item.content}
                                    title={item.title}
                                    content={
                                        item.content ? item.content : item.defaultContent
                                    }
                                    onAction={() => {
                                        if (unsavedChanges) {
                                            handleSave(false)
                                        }
                                        router.push({
                                            pathname: '/textbox-page',
                                            params: {
                                                userProfile: 'true',
                                                key: item.key,
                                                title: item.title,
                                                value: item.content,
                                            }
                                        })
                                    }}
                                />
                            ))
                        }
                    </View>
                </View>
            </Wrapper>
            {/* {isProcessing && <ProgressLoader isProcessing={true} progress={processPercentage} />} */}
            {unsavedChanges &&
                <Animated.View
                    style={[
                        styles.saveButtonContainer,
                        {
                            bottom: keyboardHeight,
                            backgroundColor: keyboardVisible ? Colors(theme).primary : 'transparent',
                            paddingHorizontal: keyboardVisible ? 0 : 16,
                            paddingBottom: keyboardVisible ? 0 : 16,
                        }
                    ]}
                >
                    {/* <ProgressBar
            progress={processPercentage / 100}
            color={Colors(theme).aliceBlue}
            style={styles.processPercentage}
          /> */}

                    <Button
                        mode="contained"
                        loading={isProcessing}
                        onPress={() => handleSave()}
                        style={[
                            styles.saveButton,
                            {
                                marginBottom: keyboardVisible ? -36 : 0,
                                height: keyboardVisible ? 60 : 'auto',
                                borderRadius: keyboardVisible ? 0 : 100,
                            }
                        ]}
                    >
                        {isProcessing ? 'Saving...' : 'Save'}
                    </Button>
                </Animated.View>}
        </View>
    );
};

export default EditProfile;
