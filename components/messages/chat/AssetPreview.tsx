import { View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";

import stylesFn from "@/styles/messages/Chat.styles";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useRef } from "react";
import { Image } from "react-native";
import { IconButton } from "react-native-paper";

interface AssetPreviewProps {
  capturedDocument: string | null;
  capturedImage: string | null;
  capturedVideo: string | null;
  setCapturedDocument: React.Dispatch<React.SetStateAction<string | null>>;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setCapturedVideo: React.Dispatch<React.SetStateAction<string | null>>;
}

const AssetPreview: React.FC<AssetPreviewProps> = ({
  capturedDocument,
  capturedImage,
  capturedVideo,
  setCapturedDocument,
  setCapturedImage,
  setCapturedVideo,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const video = useRef(null);

  if (!capturedImage && !capturedVideo && !capturedDocument) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        padding: 10,
        paddingBottom: 5,
        backgroundColor: Colors(theme).aliceBlue,
      }}
    >
      {capturedImage && (
        <View style={styles.capturedAssetContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.capturedImage}
          />
          <IconButton
            size={14}
            style={styles.closeButton}
            icon="close"
            onPress={() => setCapturedImage(null)}
          />
        </View>
      )}
      {capturedVideo && (
        <View style={styles.capturedAssetContainer}>
          <Video
            ref={video}
            style={styles.capturedVideo}
            source={{
              uri: capturedVideo ? capturedVideo : "",
            }}
            videoStyle={styles.capturedVideoStyle}
            resizeMode={ResizeMode.STRETCH}
            useNativeControls={false}
            shouldPlay={false}
          />
          <IconButton
            size={14}
            style={styles.closeButton}
            icon="close"
            onPress={() => setCapturedVideo(null)}
          />
        </View>
      )}
    </View>
  );
};

export default AssetPreview;
