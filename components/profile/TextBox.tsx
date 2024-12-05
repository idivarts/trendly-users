import { Text, View } from "../theme/Themed";
import { Card } from "react-native-paper";
import stylesFn from "@/styles/profile/ProfileCard.styles";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";
import { Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

interface TextBoxProfilePageProps {
  title: string;
  initialContent: string;
}

const TextBoxProfilePage: React.FC<TextBoxProfilePageProps> = ({
  title,
  initialContent,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const [content, setContent] = useState(initialContent);

  const value = useLocalSearchParams().value;

  useEffect(() => {
    if (value) {
      const { textbox } = JSON.parse(value as string);
      const { title: routeTitle, value: textBoxValue } = textbox;

      if (title === routeTitle) {
        setContent(textBoxValue);
      }
    }
  }, [value]);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: Colors(theme).background,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Colors(theme).text,
            fontSize: 22,
            flex: 1,
          }}
        >
          {title}
        </Text>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/textbox-page",
              params: {
                title,
                value: content,
                path: "/profile",
              },
            });
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Pressable>
      </View>
      <Text
        style={{
          color: Colors(theme).text,
          fontSize: 18,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

export default TextBoxProfilePage;
