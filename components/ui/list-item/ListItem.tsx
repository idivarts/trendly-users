import Colors from "@/constants/Colors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { List, ListItemProps as RNListItemProps } from "react-native-paper"

interface ListItemProps extends RNListItemProps {
  leftIcon?: IconProp;
}

const ListItem: React.FC<ListItemProps> = ({
  leftIcon,
  ...props
}) => {
  const theme = useTheme();

  return (
    <List.Item
      left={() => (
        <List.Icon
          icon={() => (
            <FontAwesomeIcon
              icon={leftIcon as IconProp}
              size={20}
              color={Colors(theme).text}
            />
          )}
        />
      )}
      titleStyle={{
        color: Colors(theme).text,
      }}
      {...props}
    />
  );
};

export default ListItem;
