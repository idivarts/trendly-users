import Colors from "@/shared-uis/constants/Colors";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

type Props = {
    onPress: () => void;
};

const DetailScreenOverflowMenuButton = ({ onPress }: Props) => {
    const theme = useTheme();
    const colors = Colors(theme);

    return (
        <IconButton
            icon={() => (
                <FontAwesomeIcon
                    icon={faEllipsisV}
                    size={20}
                    color={colors.text}
                />
            )}
            onPress={onPress}
            iconColor={colors.text}
        />
    );
};

export default DetailScreenOverflowMenuButton;
