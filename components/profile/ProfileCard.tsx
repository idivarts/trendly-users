import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import { Avatar, Button } from "react-native-paper";
import stylesFn from "@/styles/profile/ProfileCard.styles";
import { User } from "@/types/User";
import { PLACEHOLDER_PERSON_IMAGE } from "@/constants/Placeholder";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight, faPen } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";
import ImageUploadModal from "../ui/modal/ImageUploadModal";
import { useAuthContext, useFirebaseStorageContext } from "@/contexts";
import { useEffect, useState } from "react";

interface ProfileCardProps {
  item: User;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const { uploadImageBytes } = useFirebaseStorageContext();
  const { updateUser } = useAuthContext();

  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>();

  const handleSave = async () => {
    setIsSaving(true);

    let uploadedImage: string | null = null;

    if (capturedImage) {
      const blob = await fetch(capturedImage).then((r) => r.blob());
      uploadedImage = await uploadImageBytes(
        blob,
        `users/${item.id}-profile-image`
      );
    }

    await updateUser(item.id, {
      profileImage: uploadedImage || item.profileImage,
    });

    setIsSaving(false);
  };

  const onImageUpload = (image: string) => {
    setCapturedImage(image);
  };

  useEffect(() => {
    if (capturedImage) {
      handleSave();
    }
  }, [capturedImage]);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "relative",
        }}
      >
        <Avatar.Image
          source={{
            uri: item.profileImage || PLACEHOLDER_PERSON_IMAGE,
          }}
          size={200}
          style={styles.avatar}
        />
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
          }}
        >
          <FontAwesomeIcon icon={faPen} color={Colors(theme).text} size={22} />
        </Pressable>
        <View
          style={{
            backgroundColor: "#A69F5BD6",
            alignItems: "center",
            padding: 5,
            borderRadius: 20,
            position: "absolute",
            bottom: 0,
            right: 45,
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            {item.profile?.completionPercentage?.toString() || 0}% Complete
          </Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.name}</Text>
        <FontAwesomeIcon icon={faChevronRight} size={20} />
      </View>
      <Button
        onPress={onPress}
        buttonColor={Colors(theme).primary}
        textColor={Colors(theme).white}
        style={{
          marginVertical: 10,
        }}
      >
        Complete your Profile
      </Button>
      <ImageUploadModal
        onImageUpload={onImageUpload}
        setVisible={setIsModalVisible}
        visible={isModalVisible}
      />
    </View>
  );
};

export default ProfileCard;
