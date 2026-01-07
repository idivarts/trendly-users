import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { Pressable, View } from "react-native";

interface BackButtonProps {
    color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
    color,
}) => {
    const navigation = useMyNavigation();
    const theme = useTheme();

    return (
        <Pressable
            key={0}
            onPress={() => navigation.back()}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 8,
                }}
            >
                <Pressable
                    onPress={() => navigation.back()}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size={20}
                            color={color ?? Colors(theme).text}
                            style={{
                                opacity: pressed ? 0.8 : 1,
                            }}
                        />
                    )}
                </Pressable>
            </View>
        </Pressable>
    );
};

export default BackButton;
