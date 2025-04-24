import { View } from '@/components/theme/Themed';
import Button from '@/components/ui/button';
import Colors from '@/constants/Colors';
import { useAuthContext } from '@/contexts';
import AppLayout from '@/layouts/app-layout';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const AddInstagramManual = () => {
    const [handle, setHandle] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeImage, setActiveImage] = useState<any>(null);
    const theme = useTheme();
    const { signOutUser } = useAuthContext();

    const pickImage = async (setter: Function) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setter(result.assets[0].uri);
        }
    };

    return (
        <AppLayout withWebPadding>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors(theme).background,
                    padding: 16,
                    justifyContent: "space-between",
                    paddingBottom: 80,
                }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.heading}>Trendly</Text>
                    <Button
                        mode="text"
                        labelStyle={{
                            color: Colors(theme).primary,
                            fontSize: 16,
                        }}
                        onPress={signOutUser}
                    >
                        Logout
                    </Button>
                </View>

                <ScrollView contentContainerStyle={styles.container}>

                    <Text style={styles.label}>Instagram Handle</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="@yourhandle"
                        value={handle}
                        onChangeText={setHandle}
                    />

                    <Text style={styles.label}>Upload Profile and Dashboard Screenshot</Text>
                    <View style={{ display: "flex", flexDirection: "row", width: "100%", gap: 10 }}>
                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setProfileImage)}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
                            ) : (
                                <Text style={styles.uploadText}>Upload Profile</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setDashboardImage)}>
                            {dashboardImage ? (
                                <Image source={{ uri: dashboardImage }} style={styles.uploadedImage} />
                            ) : (
                                <Text style={styles.uploadText}>Upload Dashboard</Text>
                            )}
                        </TouchableOpacity>

                    </View>

                    {/* <Text style={styles.label}>Upload Dashboard Screenshot</Text> */}

                    <View style={styles.noteContainer}>
                        <Text style={styles.notesHeading}>Before You Continue</Text>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bulletSymbol}>{'\u2022'}</Text>
                            <Text style={styles.bulletText}>Please ensure your Instagram account is set to <Text style={{ fontWeight: '600' }}>Professional</Text> and its visibility is <Text style={{ fontWeight: '600' }}>Public</Text>.</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bulletSymbol}>{'\u2022'}</Text>
                            <Text style={styles.bulletText}>Upload <Text style={{ fontWeight: '600' }}>clear screenshots</Text> displaying your username, follower count, and other relevant details.</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bulletSymbol}>{'\u2022'}</Text>
                            <Text style={styles.bulletText}>All uploads are <Text style={{ fontWeight: '600' }}>manually verified</Text>. We’ll reach out if any clarification is needed.</Text>
                        </View>

                        <Text style={[styles.label, { marginTop: 30 }]}>Example Screenshots</Text>
                        <View style={styles.exampleRow}>
                            <Pressable onPress={() => {
                                setActiveImage(require('@/assets/images/example-profile.jpg'));
                                setModalVisible(true);
                            }}>
                                <Image source={require('@/assets/images/example-profile.jpg')} style={styles.exampleImageSmall} />
                            </Pressable>

                            <Pressable onPress={() => {
                                setActiveImage(require('@/assets/images/example-dashboard.png'));
                                setModalVisible(true);
                            }}>
                                <Image source={require('@/assets/images/example-dashboard.png')} style={styles.exampleImageSmall} />
                            </Pressable>
                        </View>
                    </View>

                    {/* Fullscreen Modal */}
                    <Modal visible={modalVisible} transparent animationType="fade">
                        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                            <Image source={activeImage} style={styles.fullImage} resizeMode="contain" />
                        </Pressable>
                    </Modal>
                </ScrollView>

                <View style={styles.stickyFooter}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginBottom: 6,
        marginTop: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    uploadBox: {
        flex: 1,
        height: 250,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadedImage: {
        // flex: 1,
        // height: 250,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    uploadText: {
        color: '#999',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007aff',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 30,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    exampleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    exampleImageSmall: {
        width: (width / 2) - 30,
        height: 160,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    noteContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 20,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    notesHeading: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletSymbol: {
        fontSize: 16,
        marginRight: 6,
        lineHeight: 22,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
});

export default AddInstagramManual;