import { Text } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import stylesFn from "@/styles/button/Button.styles";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from "react-native";

interface SocialButtonProps extends PressableProps {
  customStyles?: StyleProp<ViewStyle>;
  icon: IconProp;
  iconColor?: string;
  label: string;
  labelStyles?: StyleProp<TextStyle>;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  customStyles,
  icon,
  iconColor,
  label,
  labelStyles,
  ...props
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <Pressable
      style={[
        styles.socialButton,
        customStyles,
      ]}
      {...props}
    >
      <FontAwesomeIcon
        icon={icon}
        size={24}
        color={iconColor ? iconColor : Colors(theme).text}
        style={styles.socialButtonIcon}
      />
      <Text
        style={[
          styles.socialButtonText,
          labelStyles,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default SocialButton;
