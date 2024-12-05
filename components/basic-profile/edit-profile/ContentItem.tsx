import { Text, View } from "@/components/theme/Themed";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconButton } from "react-native-paper";

interface ContentItemProps {
  title: string;
  content: string;
  onContentChange?: (content: string) => void;
  onAction?: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  title,
  content,
  onContentChange,
  onAction,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          gap: 12,
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
        <Text>{content}</Text>
      </View>
      <IconButton
        icon={() => (
          <FontAwesomeIcon
            icon={faChevronRight}
            size={18}
          />
        )}
        onPress={() => console.log('Edit')}
      />
    </View>
  );
};

export default ContentItem;
