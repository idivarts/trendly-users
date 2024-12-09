import React, { useEffect, useState } from "react";
import { Text, View } from "../theme/Themed";
import { Pressable, useWindowDimensions } from "react-native";
import { Card } from "react-native-paper";
import stylesFn from "@/styles/profile/ProfileCard.styles";
import { useTheme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import RenderHTML from "react-native-render-html";

interface TextBoxProfilePageProps {
  title: string;
  initialContent: string;
  placeholder: string;
  defaultTextToShowIfEmpty: string;
}

const TextBoxProfilePage: React.FC<TextBoxProfilePageProps> = ({
  title,
  initialContent,
  placeholder,
  defaultTextToShowIfEmpty,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const { width } = useWindowDimensions();

  const [content, setContent] = useState(
    initialContent === "" ? defaultTextToShowIfEmpty : initialContent
  );

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
                value: initialContent === "" ? "" : initialContent,
                path: "/profile",
                placeholder: placeholder,
              },
            });
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Pressable>
      </View>
      <RenderHTML
        contentWidth={width}
        source={{
          html: content || "<p>No content available</p>",
        }}
        baseStyle={{
          color: Colors(theme).text,
          fontSize: 18,
        }}
      />
    </View>
  );
};

export default TextBoxProfilePage;
