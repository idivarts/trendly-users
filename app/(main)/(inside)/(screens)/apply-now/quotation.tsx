import { Text, View } from "@/components/theme/Themed";
import TextInput from "@/components/ui/text-input";
import AppLayout from "@/layouts/app-layout";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";

const Quotation: React.FC = () => {
    const theme = useTheme();

    const {
        title,
        value: initialValue,
        path,
        selectedFiles,
        profileAttachments,
        placeholder,
        timelineData,
        note,
        fileAttachments,
        originalAttachments,
        collaborationId,
        answers,
    } = useLocalSearchParams();
    const router = useMyNavigation()

    const [value, setValue] = useState(initialValue || "");

    const handleSubmit = () => {
        if (!value) {
            Toaster.error("Please enter a value");
            return;
        }

        const valueToSubmit = {
            textbox: {
                title,
                value,
            },
        };
        router.back();
        router.replace({
            //@ts-ignore
            pathname: path as string,
            params: {
                value: JSON.stringify(valueToSubmit),
                selectedFiles,
                profileAttachments,
                timelineData,
                originalAttachments,
                note,
                showModal: "true",
                collaborationId,
                fileAttachments,
                answers,
            },
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <AppLayout>
            <Appbar.Header
                style={{ backgroundColor: Colors(theme).background }}
                statusBarHeight={0}
            >
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={title} />
                <Pressable
                    onPress={handleSubmit}
                    style={{
                        paddingRight: 20,
                    }}
                >
                    <Text style={{ color: Colors(theme).primary, fontSize: 16 }}>
                        Done
                    </Text>
                </Pressable>
            </Appbar.Header>
            <Toast />
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
                    }}
                >
                    <Text>{title}</Text>
                    <TextInput
                        value={value as string}
                        onChangeText={setValue}
                        autoFocus
                        placeholder={placeholder as string}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default Quotation;
