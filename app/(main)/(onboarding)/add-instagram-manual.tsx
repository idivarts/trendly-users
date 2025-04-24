import AppLayout from '@/layouts/app-layout';
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
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const AddInstagramManual = () => {
    const [handle, setHandle] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeImage, setActiveImage] = useState<any>(null);

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
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Add Instagram Details</Text>

                <Text style={styles.label}>Instagram Handle</Text>
                <TextInput
                    style={styles.input}
                    placeholder="@yourhandle"
                    value={handle}
                    onChangeText={setHandle}
                />

                <Text style={styles.label}>Upload Profile Screenshot</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setProfileImage)}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
                    ) : (
                        <Text style={styles.uploadText}>Tap to upload</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.label}>Upload Dashboard Screenshot</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setDashboardImage)}>
                    {dashboardImage ? (
                        <Image source={{ uri: dashboardImage }} style={styles.uploadedImage} />
                    ) : (
                        <Text style={styles.uploadText}>Tap to upload</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

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

                {/* Fullscreen Modal */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                        <Image source={activeImage} style={styles.fullImage} resizeMode="contain" />
                    </Pressable>
                </Modal>
            </ScrollView>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
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
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadedImage: {
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
});

export default AddInstagramManual;