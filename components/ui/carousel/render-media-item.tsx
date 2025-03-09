import { ResizeMode, Video } from "expo-av";
import { ActivityIndicator, Image } from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { View } from "@/components/theme/Themed";
import { stylesFn } from "@/styles/InfluencerCard.styles";
import { imageUrl } from "@/utils/url";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";

export interface MediaItem {
  type: string;
  url: string;
}

interface RenderMediaItemProps {
  handleImagePress: (item: MediaItem) => void;
  height?: number;
  index: number;
  item: MediaItem;
  videoRefs?: React.MutableRefObject<{ [key: number]: any }>;
  width?: number;
  shouldPlay?: boolean
  useNativeControls?: boolean,
  borderRadius?: number;
}

const RenderMediaItem: React.FC<RenderMediaItemProps> = ({
  handleImagePress,
  height,
  index,
  item,
  borderRadius,
  videoRefs,
  width,
  shouldPlay,
  useNativeControls
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [isLoading, setIsLoading] = useState(false);

  if (item?.type.includes("image")) {
    return (
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleImagePress(item);
          }
        }}
      >
        <Animated.View
          style={{
            position: "relative",
          }}
        >
          <View
            style={[
              styles.loadingIndicatorContainer,
              {
                display: isLoading ? "flex" : "none",
              },
            ]}
          >
            {isLoading && <ActivityIndicator />}
          </View>
          <Image
            source={imageUrl(item.url)}
            style={[
              styles.media,
              {
                height: height || 250,
                width: width || "100%",
                borderRadius: borderRadius || 0,
              },
            ]}
            resizeMode="stretch"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
        </Animated.View>
      </TapGestureHandler>
    );
  }

  return (
    <Video
      ref={(ref) => {
        if (ref && videoRefs) {
          videoRefs.current[index] = ref;
        }
      }}
      source={{
        uri: item.url,
      }}
      style={[
        styles.media,
        {
          height: height || 250,
          width: width || "100%",
          borderRadius: borderRadius || 0,
        },
      ]}
      resizeMode={ResizeMode.COVER}
      isLooping={false}
      shouldPlay={!!shouldPlay}
      useNativeControls={!!useNativeControls}
      onError={(error) => console.error("Video Error:", error)}
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
    />
  );
};

export default RenderMediaItem;
