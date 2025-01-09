import { Platform, Pressable } from "react-native";
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
import { ResizeMode, Video } from "expo-av";
import ImageComponent from "@/shared-uis/components/image-component";

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
  const [image, setImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

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

  const { user } = useAuthContext();

  const fetchImage = async () => {
    try {
      if (!user?.profile) {
        setImage(user?.profileImage || "");
        return;
      }

      const imageToShow =
        user?.profile?.attachments && user.profile.attachments[0]
          ? user.profile.attachments[0]
          : null;

      if (imageToShow === null) {
        setImage(user?.profileImage || "");
        setIsVideo(false);
      } else if (imageToShow.type === "image") {
        setIsVideo(false);
        setImage(imageToShow.imageUrl || "");
      } else if (imageToShow.type === "video") {
        setIsVideo(true);
        Platform.OS === "ios"
          ? setImage(imageToShow.appleUrl || "")
          : setImage(imageToShow.playUrl || "");
      }
    } catch (error) {
      console.error("Error fetching image or generating thumbnail:", error);
      setImage(PLACEHOLDER_PERSON_IMAGE);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [user]);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "relative",
        }}
      >
        {!isVideo && (
          <ImageComponent
            url={image || ""}
            size="medium"
            altText="Profile Image"
            initials={item.name}
            style={styles.avatar}
            initialsSize={39}
          />
        )}
        {isVideo && (
          <Video
            source={{ uri: image || "" }}
            style={styles.video}
            isLooping={false}
            shouldPlay={false}
            resizeMode={ResizeMode.COVER}
          />
        )}
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
        <Pressable
          style={{
            backgroundColor: "#A69F5BD6",
            alignItems: "center",
            padding: 5,
            borderRadius: 20,
            position: "absolute",
            bottom: 0,
            right: 45,
          }}
          onPress={onPress}
        >
          <Text
            style={{
              color: Colors(theme).white,
            }}
          >
            {item.profile?.completionPercentage?.toString() || 0}% Complete
          </Text>
        </Pressable>
      </View>
      <Pressable style={styles.textContainer} onPress={onPress}>
        <Text style={styles.titleText}>{item.name}</Text>
        <FontAwesomeIcon icon={faChevronRight} size={20} />
      </Pressable>
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
