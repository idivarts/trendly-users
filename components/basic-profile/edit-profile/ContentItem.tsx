import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Dimensions, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import RenderHTML from "react-native-render-html";

interface ContentItemProps {
  content: string;
  empty?: boolean;
  onAction?: () => void;
  title: string;
}

const ContentItem: React.FC<ContentItemProps> = ({
  content,
  empty,
  onAction,
  title,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={onAction}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: -6,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
          <IconButton
            icon={() => (
              <FontAwesomeIcon
                icon={empty ? faPlus : faChevronRight}
                size={18}
                color={Colors(theme).text}
              />
            )}
          />
        </View>
        <RenderHTML
          contentWidth={screenWidth}
          source={{
            html: content,
          }}
          defaultTextProps={{
            style: {
              color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
              fontSize: 16,
              lineHeight: 22,
            },
          }}
        />
      </View>
    </Pressable>
  );
};

export default ContentItem;
