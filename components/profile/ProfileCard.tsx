import { PLACEHOLDER_PERSON_IMAGE } from "@/constants/Placeholder";
import { useAuthContext } from "@/contexts";
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import stylesFn from "@/styles/profile/ProfileCard.styles";
import { User } from "@/types/User";
import { faChevronRight, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text, View } from "../theme/Themed";
import Button from "../ui/button";
import ImageUploadModal from "../ui/modal/ImageUploadModal";

interface ProfileCardProps {
  item: User;
  onPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const { uploadFileUri } = useAWSContext();
  const { updateUser } = useAuthContext();

  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>();
  const [image, setImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    let imageUrl = '';

    if (capturedImage) {
      const uploadedImage = await uploadFileUri({
        id: capturedImage,
        localUri: capturedImage,
        uri: capturedImage,
        type: "image",
      });
      imageUrl = uploadedImage.imageUrl;
    }

    await updateUser(item.id, {
      profileImage: imageUrl || item.profileImage,
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
      setImage(user?.profileImage || "");
      // if (!user?.profile) {
      //   setImage(user?.profileImage || "");
      //   return;
      // }

      // const imageToShow =
      //   user?.profile?.attachments && user.profile.attachments[0]
      //     ? user.profile.attachments[0]
      //     : null;

      // if (imageToShow === null) {
      //   setImage(user?.profileImage || "");
      //   setIsVideo(false);
      // } else if (imageToShow.type === "image") {
      //   setIsVideo(false);
      //   setImage(imageToShow.imageUrl || "");
      // } else if (imageToShow.type === "video") {
      //   setIsVideo(true);
      //   Platform.OS === "ios"
      //     ? setImage(imageToShow.appleUrl || "")
      //     : setImage(imageToShow.playUrl || "");
      // }
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
            top: 10,
            right: 10,
            padding: 10,
            backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).tag,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: theme.dark ? Colors(theme).white : Colors(theme).primary,
          }}
        >
          <FontAwesomeIcon
            icon={faPen}
            color={theme.dark ? Colors(theme).white : Colors(theme).primary}
            size={22}
          />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: Colors(theme).yellow100,
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
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
        <FontAwesomeIcon icon={faChevronRight} size={18} style={{ marginLeft: 6 }} />
      </Pressable>
      <Button
        onPress={onPress}
        style={{
          marginVertical: 10,
        }}
      >
        {(item.profile?.completionPercentage && item.profile?.completionPercentage > 60) ? "Edit Profile" : "Complete your Profile"}
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
