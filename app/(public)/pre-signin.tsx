import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { Title, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import createStyles from "@/styles/tab1.styles"; // Import the function, not the styles directly
import { useTheme } from "@react-navigation/native";
import AppLayout from "@/layouts/app-layout";
import { Link } from "expo-router";
import { useAuthContext } from "@/contexts";
import { slides } from "@/constants/Slides";

const PreSignIn = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderSocialButton = (
    iconName: string,
    label: string,
    link: string
  ) => (
    <TouchableOpacity style={styles.socialButton} onPress={() => { }}>
      <Ionicons
        name={iconName as any}
        size={24}
        color={colors.text}
        style={styles.icon}
      />
      <Link href={link}>
        <Text style={styles.socialButtonText}>{label}</Text>
      </Link>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <Swiper
        style={styles.wrapper}
        dotStyle={styles.dotStyle}
        activeDotStyle={[styles.dotStyle, { backgroundColor: colors.primary }]}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide) => (
          <View style={styles.slide} key={slide.key}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: slide.image }} style={styles.image} />
            </View>
            <Title style={[styles.title, { color: colors.primary }]}>
              {slide.title}
            </Title>
            <Paragraph style={styles.paragraph}>{slide.text}</Paragraph>
            {slide.key === "connect" && (
              <View style={styles.socialContainer}>
                {renderSocialButton(
                  "logo-facebook",
                  "Login with Facebook",
                  "/questions"
                )}
                {renderSocialButton(
                  "mail-outline",
                  "Login with Email",
                  "/questions"
                )}
                {renderSocialButton(
                  "logo-instagram",
                  "Login with Instagram",
                  "/questions"
                )}
              </View>
            )}
          </View>
        ))}
      </Swiper>
    </AppLayout>
  );
};

export default PreSignIn;
