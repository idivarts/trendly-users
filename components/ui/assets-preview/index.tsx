import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/assets-preview/AssetsPreview.styles";
import { imageUrl } from "@/utils/url";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { Image, Platform, Pressable, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import Button from "../button";

interface FileAsset {
  id: string;
  type: string;
  url: string;
}

interface AssetsPreviewProps {
  files: FileAsset[];
  handleAssetUpload: () => void;
  onRemove?: (id: string) => void;
}

const AssetsPreview: React.FC<AssetsPreviewProps> = ({
  files,
  handleAssetUpload,
  onRemove,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  // useEffect(() => {
  //   console.log("Files:", files)
  // }, [files])
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {files.map((file, index) => (
          <View key={file.id + file.url + index} style={styles.fileContainer}>
            {file.type.includes("video") ? (
              <Video
                source={{
                  uri: file.url,
                }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                useNativeControls={false}
                onLoad={(status) => console.log("Video Loaded:", status)}
                onError={(error) => console.error("Video Error:", error)}
                onReadyForDisplay={(videoData) => {
                  if (Platform.OS === "web") {
                    // @ts-ignore
                    videoData.srcElement.style.position = "initial";
                  }
                }}
              />
            ) : (
              <Image
                source={imageUrl(file.url)}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            {onRemove && (
              <IconButton
                icon={() => <FontAwesomeIcon icon={faTrash} size={12} />}
                style={[
                  styles.iconButton,
                  { backgroundColor: Colors(theme).white },
                ]}
                size={12}
                onPress={() => onRemove(file.id)}
              />
            )}
          </View>
        ))}
        {Platform.OS == "web" &&
          <Pressable onPress={handleAssetUpload}>
            <View key={"add-more"} style={[styles.fileContainer, { flexDirection: "column" }]}>
              <FontAwesomeIcon icon={faAdd} size={28}></FontAwesomeIcon>
              <Text style={{ fontSize: 14, marginTop: 8 }}>Add More</Text>
            </View>
          </Pressable>
        }
      </ScrollView>
      <Button
        mode="contained"
        onPress={handleAssetUpload}
        style={[
          styles.editButton,
          {
            display: Platform.OS === "web" ? "none" : "flex",
          },
        ]}
      >
        Edit
      </Button>
    </View>
  );
};

export default AssetsPreview;
