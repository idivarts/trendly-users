import { Text, View } from "@/components/theme/Themed";
import { Console } from "@/shared-libs/utils/console";
import Colors from "@/shared-uis/constants/Colors";
import stylesFn from "@/styles/assets-preview/AssetsPreview.styles";
import { imageUrl } from "@/utils/url";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { Image, Platform, Pressable, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";

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
                onLoad={(status) => Console.log("Video Loaded:", status)}
                onError={(error) => Console.error("Video Error:", error)}
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
        <Pressable onPress={handleAssetUpload}>
          <View key={"add-more"} style={[styles.fileContainer, { flexDirection: "column" }]}>
            <FontAwesomeIcon icon={faAdd} size={28}></FontAwesomeIcon>
            <Text style={{
              fontSize: 14, color: Colors(theme).text, marginTop: 8
            }}>Add More</Text>
          </View>
        </Pressable>

      </ScrollView>
      {/* <Button
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
      </Button> */}
    </View>
  );
};

export default AssetsPreview;
