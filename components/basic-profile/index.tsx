import { Avatar, Button, TextInput } from "react-native-paper";
import { Text, View } from "../theme/Themed";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { useAuthContext } from "@/contexts";
import { User } from "@/types/User";
import { useBreakpoints } from "@/hooks";
import stylesFn from "@/styles/basic-profile/BasicProfile.styles";
import { useTheme } from "@react-navigation/native";
import { DUMMY_IMAGE } from "@/constants/User";
import ImageUploadModal from "../ui/modal/ImageUploadModal";
import { useAWSContext } from "@/contexts/aws-context.provider";

interface BasicProfileProps {
  user: User;
}

const BasicProfile: React.FC<BasicProfileProps> = ({ user }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [capturedImage, setCapturedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const { lg } = useBreakpoints();

  const { uploadFileUri } = useAWSContext();
  const { updateUser } = useAuthContext();

  const handleSave = async () => {
    if (!name) {
      return;
    }

    setIsSaving(true);

    let imageUrl = "";

    if (capturedImage) {
      const uploadedImage = await uploadFileUri({
        id: capturedImage,
        localUri: capturedImage,
        uri: capturedImage,
        type: "image",
      });
      imageUrl = uploadedImage.imageUrl;
    }

    await updateUser(user.id, {
      name,
      email,
      phoneNumber,
      profileImage: imageUrl || user.profileImage,
    });

    setIsSaving(false);
  };

  const onImageUpload = (image: string) => {
    setCapturedImage(image);
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: lg ? "auto" : 0,
        },
      ]}
    >
      <View style={styles.avatarSection}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              source={{
                uri: capturedImage || user.profileImage || DUMMY_IMAGE,
              }}
              size={56}
            />
            <Pressable onPress={() => setIsModalVisible(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: lg ? 20 : 10,
            }}
          >
            <Text>Enter your name and add an optional profile picture</Text>
          </View>
        </View>
      </View>
      <View style={styles.textInputContainer}>
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
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </View>
      <ImageUploadModal
        onImageUpload={onImageUpload}
        setVisible={setIsModalVisible}
        visible={isModalVisible}
      />
    </View>
  );
};

export default BasicProfile;
