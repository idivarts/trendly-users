import { Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { draggableGridStylesFn } from "@/styles/draggable-grid/DraggableGrid.styles";

interface AssetRenderProps {
  asset: {
    url: string;
    type: string;
  } | null;
}

const AssetRender: React.FC<AssetRenderProps> = ({
  asset,
}) => {
  const theme = useTheme();
  const styles = draggableGridStylesFn(theme);

  if (!asset) {
    return null;
  } else if (asset.type === 'video') {
    return (
      <Video
        source={{ uri: asset.url }}
        style={styles.video}
        isLooping={false}
        shouldPlay={false}
        resizeMode={ResizeMode.COVER}
      >
      </Video>
    );
  } else {
    return (
      <Image
        source={{ uri: asset.url }}
        style={styles.image}
      />
    );
  }
};

export default AssetRender;
