import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native-paper"

interface TextInputProps extends RNTextInputProps { }

const TextInput: React.FC<TextInputProps> = ({
  ...props
}) => {
  const theme = useTheme();

  return (
    <RNTextInput
      style={{
        backgroundColor: Colors(theme).background,
      }}
      textColor={Colors(theme).text}
      placeholderTextColor={Colors(theme).text}
      activeOutlineColor={Colors(theme).primary}
      mode="outlined"
      {...props}
    />
  );
};

export default TextInput;
