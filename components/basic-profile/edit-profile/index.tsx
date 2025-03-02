import VerifiedIcon from "@/assets/icons/verified.svg";
import { Text, View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import SelectGroup from "@/components/ui/select/select-group";
import TextInput from "@/components/ui/text-input";
import Colors from "@/constants/Colors";
import { useBreakpoints } from "@/hooks";
import useEditProfile from "@/hooks/use-edit-profile";
import { stylesFn } from "@/styles/edit-profile/EditProfile.styles";
import { processRawAttachment } from "@/utils/attachments";
import { generateEmptyAssets } from "@/utils/profile";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Keyboard, Platform, Pressable } from "react-native";
import { ProgressBar } from "react-native-paper";
import ContentItem from "./ContentItem";
import DragAndDropNative from "./grid/native/DragAndDropNative";
import DragAndDropWeb from "./grid/web/DragAndDropWeb";
import Wrapper from "./grid/wrapper";

interface EditProfileProps {
  unsavedChanges?: boolean;
  setUnsavedChanges?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile: React.FC<EditProfileProps> = ({
  unsavedChanges,
  setUnsavedChanges,
}) => {
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const router = useRouter();

  const {
    xl,
  } = useBreakpoints();

  const items = [
    { url: '', type: '' },
    { url: '', type: '' },
    { url: '', type: '' },
    { url: '', type: '' },
    { url: '', type: '' },
    { url: '', type: '' },
  ];

  const {
    contents,
    email,
    handleAssetsUpdateNative,
    handleAssetsUpdateWeb,
    handleNicheSelect,
    handleSave,
    isProcessing,
    name,
    nativeAssets,
    niches,
    phoneNumber,
    processPercentage,
    setEmail,
    setName,
    setPhoneNumber,
    setTimeCommitment,
    timeCommitment,
    user,
    verifyEmail,
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
        {
          Platform.OS === 'web' ? (
            <DragAndDropWeb
              items={user?.profile?.attachments?.map((attachment, index) => {
                return {
                  ...processRawAttachment(attachment),
                  id: index.toString(),
                }
              }) || []}
              onUploadAsset={handleAssetsUpdateWeb}
            />
          ) : (
            <DragAndDropNative
              items={
                generateEmptyAssets(user?.profile?.attachments as any, items).map((item, index) => {
                  return {
                    ...item,
                    id: index,
                  }
                })
              }
              onItemsUpdate={handleAssetsUpdateNative}
            />
          )
        }
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
                onChangeText={(email) => {
                  setEmail(email);
                  setUnsavedChanges && setUnsavedChanges(true);
                }}
              />
              {
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
              }
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
              <Button
                mode="contained"
                size="small"
                style={{
                  marginTop: 6,
                }}
                onPress={() => null}
              >
                {user?.phoneVerified ? 'Verified' : 'Verify'}
              </Button>
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
              items={[
                { label: 'Full Time', value: 'Full Time' },
                { label: 'Part Time', value: 'Part Time' },
                { label: 'Hobby', value: 'Hobby' },
              ]}
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
              items={[
                { label: 'Fashion', value: 'Fashion' },
                { label: 'Lifestyle', value: 'Lifestyle' },
                { label: 'Food', value: 'Food' },
                { label: 'Travel', value: 'Travel' },
                { label: 'Health', value: 'Health' },
              ]}
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
                  onAction={() => router.push({
                    pathname: '/textbox-page',
                    params: {
                      userProfile: 'true',
                      key: item.key,
                      title: item.title,
                      value: item.content,
                    }
                  })}
                />
              ))
            }
          </View>
        </View>
      </Wrapper>
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
        <ProgressBar
          progress={processPercentage / 100}
          color={Colors(theme).aliceBlue}
          style={styles.processPercentage}
        />
        <Pressable
          onPress={handleSave}
        >
          <Button
            mode="contained"
            loading={isProcessing}
            onPress={handleSave}
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
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default EditProfile;
