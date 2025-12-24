import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import {
    Button as RNPButton,
    ButtonProps as RNPButtonProps,
} from "react-native-paper";

interface ButtonProps extends RNPButtonProps {
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    contentStyle,
    style,
    size,
    ...props
}) => {
    const theme = useTheme();
    return (
        <RNPButton
            mode="contained"
            style={[
                style,
            ]}
            contentStyle={[
                size === 'small' && {
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                },
                contentStyle,
            ]}
            labelStyle={[
                size === 'small' && {
                    fontSize: 12,
                },
                size === 'medium' && {
                    fontSize: 16,
                },
                size === 'large' && {
                    fontSize: 20,
                },
            ]}
            textColor={props.mode == "outlined" ? (theme.dark ? Colors(theme).secondary : Colors(theme).primary) : undefined}
            {...props}
        />
    );
};

export default Button;