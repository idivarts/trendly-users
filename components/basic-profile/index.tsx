import { Avatar, Button, TextInput } from "react-native-paper";
import { Text, View } from "../theme/Themed";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { useAuthContext, useFirebaseStorageContext } from "@/contexts";
import * as ImagePicker from 'expo-image-picker';
import { User } from "@/types/User";
import { useBreakpoints } from "@/hooks";
import stylesFn from "@/styles/basic-profile/BasicProfile.styles";
import { useTheme } from "@react-navigation/native";
import { DUMMY_IMAGE } from "@/constants/User";

interface BasicProfileProps {
  user: User;
}

const BasicProfile: React.FC<BasicProfileProps> = ({
  user,
}) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [capturedImage, setCapturedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const {
    lg,
  } = useBreakpoints();

  const {
    uploadImage,
  } = useFirebaseStorageContext();
  const {
    updateUser,
  } = useAuthContext();

  const handleSave = async () => {
    if (!name) {
      return;
    }

    setIsSaving(true);

    let uploadedImage: string | null = null;

    if (capturedImage) {
      uploadedImage = await uploadImage(
        capturedImage,
        `users/${user.id}-profile-image`,
      );
    }

    await updateUser(
      user.id,
      {
        name,
        email,
        phoneNumber,
        profileImage: uploadedImage || user.profileImage,
      },
    );

    setIsSaving(false);
  }

  const imageUpload = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('We need camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: lg ? "auto" : 0,
        }
      ]}
    >
      <View
        style={styles.avatarSection}
      >
        <View
          style={styles.avatarRow}
        >
          <View
            style={styles.avatarContainer}
          >
            <Avatar.Image
              source={{
                uri: capturedImage || user.profileImage || DUMMY_IMAGE,
              }}
              size={56}
            />
            <Pressable
              onPress={imageUpload}
            >
              <Text
                style={styles.editButton}
              >
                Edit
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: lg ? 20 : 10,
            }}
          >
            <Text>
              Enter your name and add an optional profile picture
            </Text>
          </View>
        </View>
      </View>
      <View
        style={styles.textInputContainer}
      >
        <TextInput
          style={{
            backgroundColor: Colors(theme).background,
          }}
          textColor={Colors(theme).text}
          placeholderTextColor={Colors(theme).text}
          activeOutlineColor={Colors(theme).primary}
          label="Name"
          mode="outlined"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={{
            backgroundColor: Colors(theme).background,
          }}
          textColor={Colors(theme).text}
          placeholderTextColor={Colors(theme).text}
          activeOutlineColor={Colors(theme).primary}
          label="Email"
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={{
            backgroundColor: Colors(theme).background,
          }}
          textColor={Colors(theme).text}
          placeholderTextColor={Colors(theme).text}
          activeOutlineColor={Colors(theme).primary}
          label="Phone number"
          mode="outlined"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
      </View>
      <View
        style={styles.buttonContainer}
      >
        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={handleSave}
        >
          {
            isSaving
              ? "Saving..."
              : "Save"
          }
        </Button>
      </View>
    </View>
  );
};

export default BasicProfile;
