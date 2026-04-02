import { Text, View } from "@/components/theme/Themed";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Modal } from "react-native-paper";

interface ManagerModalProps {
    manager: {
        name: string;
        email: string;
        image: string;
    };
    brandDescription: string;
    visible: boolean;
    setVisibility: (visible: boolean) => void;
}

const ManagerModal: React.FC<ManagerModalProps> = ({
    manager,
    brandDescription,
    visible,
    setVisibility,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <Modal
            visible={visible}
            onDismiss={() => setVisibility(false)}
            contentContainerStyle={styles.modalContainer}
        >
            <View style={styles.inner}>
                <ImageComponent
                    url={manager.image}
                    initials={manager.name}
                    initialsSize={40}
                    altText="Manager Image"
                    style={styles.avatar}
                />

                <Text style={styles.name}>{manager.name}</Text>

                <Text style={styles.description}>{brandDescription}</Text>

                <View style={styles.emailRow}>
                    <Text style={styles.emailText}>Email: {manager.email}</Text>
                </View>
            </View>
        </Modal>
    );
};

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        modalContainer: {
            backgroundColor: c.background,
            borderRadius: 10,
            padding: 20,
            marginHorizontal: 20,
        },
        inner: {
            alignItems: "center",
            gap: 20,
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 240,
        },
        name: {
            fontSize: 24,
            fontWeight: "bold",
            color: c.text,
            textAlign: "center",
        },
        description: {
            fontSize: 16,
            color: c.text,
            textAlign: "center",
        },
        emailRow: {
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
        },
        emailText: {
            fontSize: 16,
            color: c.text,
        },
    });
}

export default ManagerModal;
