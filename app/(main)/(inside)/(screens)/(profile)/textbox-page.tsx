import Component from "@/components/textbox-rtf/TextBox";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { User } from "@/types/User";
import { calculateProfileCompletion } from "@/utils/profile";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const EditTextArea: React.FC = () => {
    const theme = useTheme();
    const router = useMyNavigation();
    const [loading, setLoading] = useState(false)

    const {
        userProfile,
        key,
        title,
        value: initialValue,
        path,
        placeholder,
    } = useLocalSearchParams();

    const [value, setValue] = useState(initialValue || "");

    const { user, updateUser } = useAuthContext();

    const handleUpdateProfileContent = async () => {
        setLoading(true)
        try {
            if (!user) return;


            const content = {
                ...(user?.profile?.content || {}),
                [key as string]: value ? value : "",
            };
            Console.log("Updating profile content", content);

            const percentage = calculateProfileCompletion({
                ...user,
                profile: {
                    ...(user?.profile || {}),
                    content,
                }
            });

            const updatedContent: Partial<User> = {
                // ...user,
                profile: {
                    ...(user?.profile || {}),
                    completionPercentage: percentage,
                    content,
                },
            };

            Console.log("Updating profile content 2", updatedContent);
            await updateUser(user.id, updatedContent).then(() => {
                handleGoBack()
                Toaster.success(`${title ? title : "Profile"} updated successfully`);
            });
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = () => {
        // if (!value) {
        //   Toaster.error("Please enter a value");
        //   return;
        // }
        if (userProfile === "true") {
            handleUpdateProfileContent();
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <AppLayout>
            <ScreenHeader title={title as string} action={handleGoBack} rightAction={true} rightActionButton={<>
                {loading ? <ActivityIndicator size={"small"} style={{ paddingRight: 20 }} /> :
                    <Pressable
                        onPress={handleSubmit}
                        style={{
                            paddingRight: 20,
                        }}
                    >
                        <Text style={{ color: Colors(theme).primary, fontSize: 16 }}>
                            Done
                        </Text>
                    </Pressable>}
            </>} />
            {/* <Appbar.Header
        style={{ backgroundColor: Colors(theme).background }}
        statusBarHeight={0}
      >
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title={title} />
        {loading ? <ActivityIndicator size={"small"} style={{ paddingRight: 20 }} /> :
          <Pressable
            onPress={handleSubmit}
            style={{
              paddingRight: 20,
            }}
          >
            <Text style={{ color: Colors(theme).primary, fontSize: 16 }}>
              Done
            </Text>
          </Pressable>}
      </Appbar.Header> */}
            {/* <Toast /> */}
            <View
                style={{
                    padding: 20,
                    justifyContent: "space-between",
                    flex: 1,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                    }}
                >
                    <Text>{title}</Text>
                    <Component
                        value={value as string}
                        setValue={setValue}
                        placeholder={placeholder}
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default EditTextArea;
