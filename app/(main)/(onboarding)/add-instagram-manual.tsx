import { View } from '@/components/theme/Themed';
import Button from '@/components/ui/button';
import ScreenHeader from '@/components/ui/screen-header';
import TextInput from '@/components/ui/text-input';
import Colors from '@/constants/Colors';
import { useAWSContext } from '@/contexts/aws-context.provider';
import AppLayout from '@/layouts/app-layout';
import Toaster from '@/shared-uis/components/toaster/Toaster';
import { HttpWrapper } from '@/utils/http-wrapper';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const { width } = Dimensions.get('window');

const AddInstagramManual = () => {
    const [handle, setHandle] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [dashboardImageUrl, setDashboardImageUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeImage, setActiveImage] = useState<any>(null);
    const theme = useTheme();
    const { uploadFileUri, uploadFile } = useAWSContext();
    const pRef = useRef<any>()
    const dRef = useRef<any>()

    const pickImage = async (setter: Function, urlSetter: Function) => {
        urlSetter(null);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setter(result.assets[0].uri);
            uploadFileUri({
                id: result.assets[0].assetId + "",
                type: 'image',
                localUri: result.assets[0].uri,
                uri: result.assets[0].uri,
            }).then((asset) => {
                urlSetter(asset.imageUrl)
            }).catch((error) => {
                setter(null);
                Toaster.error('Cant upload image', error.message);
            });
        }
    };
    const pickFile = async (event: React.ChangeEvent<HTMLInputElement>,
        setter: Function, urlSetter: Function) => {
        const file = event.target.files?.[0]
        if (file) {
            urlSetter(null);
            setter(URL.createObjectURL(file));
            uploadFile(file).then((asset) => {
                urlSetter(asset.imageUrl)
            }).catch((error) => {
                setter(null);
                Toaster.error('Cant upload image', error.message);
            });
        }
    };


    const onClickContinue = async () => {
        console.log("Instagram Manual", handle, profileImageUrl, dashboardImageUrl);

        if (!handle || !profileImageUrl || !dashboardImageUrl) {
            Toaster.error('Please fill all the fields');
            return;
        }

        await HttpWrapper.fetch('/api/v1/socials/instagram/manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                handle: handle,
                profileImage: profileImageUrl,
                dashboardImage: dashboardImageUrl,
            }),
        }).then(response => {
            Toaster.success('Instagram added successfully');
            router.back()
        }).catch((error) => {
            console.error(error);
            Toaster.error('Error adding Instagram', error.message);
        });
    }

    return (
        <AppLayout withWebPadding>
            <ScreenHeader title='Add Instagram' />

            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.label}>Add your Instagram handle</Text>
                <TextInput
                    label="Instagram Handle (@...)"
                    value={handle}
                    style={{ width: '100%', marginTop: 8, marginBottom: 16 }}
                    placeholderTextColor={Colors(theme).textSecondary}
                    placeholder='@trendly'
                    onChangeText={(name) => {
                        if (!name.startsWith('@') && name.length > 0) {
                            setHandle("@" + name);
                        } else {
                            setHandle(name);
                        }
                    }} />

                <Text style={styles.label}>Upload Profile and Dashboard Screenshot</Text>
                <View style={{ display: "flex", flexDirection: "row", width: "100%", gap: 10, marginTop: 8 }}>
                    <TouchableOpacity style={styles.uploadBox} onPress={() =>
                        Platform.OS === 'web' ? pRef.current.click() : pickImage(setProfileImage, setProfileImageUrl)}>
                        {profileImage ? (
                            <>
                                <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
                                {!profileImageUrl && <ActivityIndicator style={{ position: "absolute", zIndex: 100 }} size={"large"} />}
                            </>
                        ) : (
                            <>
                                <Text style={styles.uploadText}>Upload Profile</Text>
                                {Platform.OS === 'web' && <input type='file' ref={pRef} accept='image/*' hidden
                                    onChange={(e) => pickFile(e, setProfileImage, setProfileImageUrl)} />}
                            </>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.uploadBox} onPress={() =>
                        Platform.OS === 'web' ? dRef.current.click() : pickImage(setDashboardImage, setDashboardImageUrl)}>
                        {dashboardImage ? (
                            <>
                                <Image source={{ uri: dashboardImage }} style={styles.uploadedImage} />
                                {!dashboardImageUrl && <ActivityIndicator style={{ position: "absolute", zIndex: 100 }} size={"large"} />}
                            </>
                        ) : (
                            <>
                                <Text style={styles.uploadText}>Upload Dashboard</Text>
                                {Platform.OS === 'web' && <input type='file' ref={dRef} accept='image/*' hidden
                                    onChange={(e) => pickFile(e, setDashboardImage, setDashboardImageUrl)} />}
                            </>
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

                    <Text style={[styles.notesHeading, { marginTop: 30 }]}>Example Screenshots</Text>
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
                <Button size='medium'
                    style={styles.button}
                    onPress={onClickContinue}
                    disabled={handle.length < 1 || !profileImageUrl || !dashboardImageUrl}>
                    Continue
                </Button>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120,
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
        fontWeight: "bold",
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
        // backgroundColor: '#007aff',
        paddingVertical: 8,
        // paddingHorizontal: 40,
        // borderRadius: 10,
        marginTop: 16,
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
        justifyContent: 'flex-start',
        gap: 10,
        width: '100%',
        marginTop: 10,
        backgroundColor: "unset"
    },
    exampleImageSmall: {
        maxWidth: Math.min(width / 2 - 60, 200),
        maxHeight: 300,
        borderRadius: 10,
        margin: 8
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