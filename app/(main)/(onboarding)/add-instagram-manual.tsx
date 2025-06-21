import { View } from '@/components/theme/Themed';
import Button from '@/components/ui/button';
import ScreenHeader from '@/components/ui/screen-header';
import Select, { SelectItem } from '@/components/ui/select';
import TextInput from '@/components/ui/text-input';
import { useSocialContext } from '@/contexts';
import AppLayout from '@/layouts/app-layout';
import { useAWSContext } from "@/shared-libs/contexts/aws-context.provider";
import { ISocials } from '@/shared-libs/firestore/trendly-pro/models/socials';
import { Console } from '@/shared-libs/utils/console';
import { AuthApp } from '@/shared-libs/utils/firebase/auth';
import { FirestoreDB } from '@/shared-libs/utils/firebase/firestore';
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from '@/shared-uis/components/toaster/Toaster';
import Colors from '@/shared-uis/constants/Colors';
import { resetAndNavigate } from '@/utils/router';
import { Theme, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
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
;

const { width } = Dimensions.get('window');

const AddInstagramManual = () => {
    const theme = useTheme();
    const [handle, setHandle] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [dashboardImage, setDashboardImage] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [dashboardImageUrl, setDashboardImageUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeImage, setActiveImage] = useState<any>(null);
    const { uploadFileUri, uploadFile } = useAWSContext();
    const pRef = useRef<any>()
    const dRef = useRef<any>()
    const { primarySocial } = useSocialContext()
    const router = useRouter();
    const { socialId } = useLocalSearchParams()

    const styles = stylesFn(theme);

    const [apiLoading, setApiLoading] = useState(false)
    const [blockLoading, setBlockLoading] = useState(false)

    // Metrics states
    const [followerRange, setFollowerRange] = useState<SelectItem[]>([]);
    const [monthlyViews, setMonthlyViews] = useState<SelectItem[]>([]);
    const [monthlyInteractions, setMonthlyInteractions] = useState<SelectItem[]>([]);

    const [social, setSocial] = useState<ISocials | undefined>(undefined)


    const getSocial = async (id: string) => {
        if (!AuthApp.currentUser)
            return;
        try {
            const docRef = doc(FirestoreDB, 'users', AuthApp.currentUser?.uid, 'socials', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const soc = (await docSnap.data()) as ISocials;
                setSocial(soc);
            } else {
                Console.error("No such document!");
                return null;
            }
        } catch (error) {
            Console.error(error, "Error getting Social document");
            return null;
        }
    }
    useEffect(() => {
        getSocial(socialId as string)
    }, [socialId])

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
        Console.log("Instagram Manual", handle, profileImageUrl, dashboardImageUrl);

        if (!socialId) {
            if (handle.length <= 1 || !profileImageUrl || !dashboardImageUrl) {
                Toaster.error('Please fill all the fields');
                return;
            }
            const handleRegex = /^@[a-zA-Z0-9._]{1,30}$/;
            if (!handleRegex.test(handle)) {
                Toaster.error('Invalid Instagram handle', 'Ensure it starts with @ and contains only letters, numbers, periods, or underscores.');
                return;
            }
        }

        setApiLoading(true);
        await HttpWrapper.fetch('/api/v1/socials/instagram/manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...((socialId && social) ? {
                    handle: social.instaProfile?.username,
                    profileImage: social.socialScreenShots?.[0],
                    dashboardImage: social.socialScreenShots?.[1]
                } : {
                    handle: handle.substring(1),
                    profileImage: profileImageUrl,
                    dashboardImage: dashboardImageUrl
                }),

                socialId: socialId || undefined,
                followerRange: followerRange[0].value,
                monthlyViews: monthlyViews[0].value,
                monthlyInteractions: monthlyInteractions[0].value,
            }),
        }).then(response => {
            Toaster.success('Instagram added successfully');
            if (primarySocial) {
                if (router.canGoBack()) {
                    router.back();
                } else if (socialId) {
                    resetAndNavigate('/collaborations');
                } else {
                    resetAndNavigate('/connected-socials');
                }
            } else {
                setBlockLoading(true);
            }
        }).catch((error) => {
            Console.error(error);
            Toaster.error('Error adding Instagram', error.message);
        }).finally(() => {
            setApiLoading(false);
        });
    }

    return (
        <AppLayout withWebPadding={true}>
            <ScreenHeader title={socialId ? 'Update your Instagram Metrics' : 'Add Instagram'} />

            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors(theme).background }]}>

                {!socialId && <>
                    <Text style={[styles.label, { color: Colors(theme).text }]}>Add your Instagram handle</Text>
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

                    <Text style={[styles.label, { color: Colors(theme).text }]}>Upload Profile and Dashboard Screenshot</Text>
                    <View style={{ display: "flex", flexDirection: "row", width: "100%", gap: 10, marginTop: 8 }}>
                        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: Colors(theme).card, borderColor: Colors(theme).border }]} onPress={() =>
                            Platform.OS === 'web' ? pRef.current.click() : pickImage(setProfileImage, setProfileImageUrl)}>
                            {profileImage ? (
                                <>
                                    <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
                                    {!profileImageUrl && <ActivityIndicator style={{ position: "absolute", zIndex: 100 }} size={"large"} />}
                                </>
                            ) : (
                                <>
                                    <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                                        <Text style={[styles.uploadText, { color: Colors(theme).textSecondary }]}>Upload Profile Screenshot</Text>
                                        <Text style={[styles.uploadHint, { color: Colors(theme).textSecondary }]}>Take a screenshot of your profile showing username and followers</Text>
                                    </View>
                                    {Platform.OS === 'web' && <input type='file' ref={pRef} accept='image/*' hidden
                                        onChange={(e) => pickFile(e, setProfileImage, setProfileImageUrl)} />}
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: Colors(theme).card, borderColor: Colors(theme).border }]} onPress={() =>
                            Platform.OS === 'web' ? dRef.current.click() : pickImage(setDashboardImage, setDashboardImageUrl)}>
                            {dashboardImage ? (
                                <>
                                    <Image source={{ uri: dashboardImage }} style={styles.uploadedImage} />
                                    {!dashboardImageUrl && <ActivityIndicator style={{ position: "absolute", zIndex: 100 }} size={"large"} />}
                                </>
                            ) : (
                                <>
                                    <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                                        <Text style={[styles.uploadText, { color: Colors(theme).textSecondary }]}>Upload Dashboard Screenshot</Text>
                                        <Text style={[styles.uploadHint, { color: Colors(theme).textSecondary }]}>From Instagram → Insights → Last 30 days summary</Text>
                                    </View>
                                    {Platform.OS === 'web' && <input type='file' ref={dRef} accept='image/*' hidden
                                        onChange={(e) => pickFile(e, setDashboardImage, setDashboardImageUrl)} />}
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </>}


                {/* <Text style={styles.label}>Upload Dashboard Screenshot</Text> */}

                {/* Add Your Metrics Section */}
                <Text style={[styles.label, { color: Colors(theme).text, fontWeight: 600 }]}>Add Your Metrics</Text>
                <View style={{ width: '100%', marginTop: 8 }}>
                    <Text style={[styles.label, { color: Colors(theme).text }]}>Follower Counts</Text>
                    <Select
                        items={[
                            { label: 'Less than 1,000', value: '<1K' },
                            { label: '1,000 - 5,000', value: '1K-5K' },
                            { label: '5,000 - 10,000', value: '5K-10K' },
                            { label: '10,000 - 50,000', value: '10K-50K' },
                            { label: '50,000 - 100,000', value: '50K-100K' },
                            { label: '100,000+', value: '100K+' },
                        ]}
                        selectItemIcon={true}
                        value={followerRange}
                        onSelect={(val) => setFollowerRange(val)}
                    />
                    <Text style={[styles.label, { color: Colors(theme).text }]}>Monthly View Count</Text>
                    <Select
                        items={[
                            { label: 'Less than 5,000', value: '<5K' },
                            { label: '5,000 - 20,000', value: '5K-20K' },
                            { label: '20,000 - 50,000', value: '20K-50K' },
                            { label: '50,000 - 100,000', value: '50K-100K' },
                            { label: '100,000 - 1M', value: '100K-1M' },
                            { label: '1M+', value: '1M+' },
                        ]}
                        selectItemIcon={true}
                        value={monthlyViews}
                        onSelect={(val) => setMonthlyViews(val)}
                    />
                    <Text style={[styles.label, { color: Colors(theme).text }]}>Monthly Interaction Count</Text>
                    <Select
                        items={[
                            { label: 'Less than 1,000', value: '<1K' },
                            { label: '1,000 - 5,000', value: '1K-5K' },
                            { label: '5,000 - 15,000', value: '5K-15K' },
                            { label: '15,000 - 50,000', value: '15K-50K' },
                            { label: '50,000+', value: '50K+' },
                        ]}
                        selectItemIcon={true}
                        value={monthlyInteractions}
                        onSelect={(val) => setMonthlyInteractions(val)}
                    />
                </View>

                <View style={[styles.noteContainer, { backgroundColor: Colors(theme).card, borderColor: Colors(theme).border }]}>
                    <Text style={[styles.notesHeading, { color: Colors(theme).text }]}>Before You Continue</Text>
                    {!socialId && <>
                        <View style={styles.bulletPoint}>
                            <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                            <Text style={[styles.bulletText, { color: Colors(theme).text }]}>Please ensure your Instagram account is set to <Text style={{ fontWeight: '600' }}>Professional</Text> and its visibility is <Text style={{ fontWeight: '600' }}>Public</Text>.</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                            <Text style={[styles.bulletText, { color: Colors(theme).text }]}>Upload <Text style={{ fontWeight: '600' }}>clear screenshots</Text> displaying your username, follower count, and other relevant details.</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                            <Text style={[styles.bulletText, { color: Colors(theme).text }]}>All uploads are <Text style={{ fontWeight: '600' }}>manually verified</Text>. We’ll reach out if any clarification is needed.</Text>
                        </View>
                    </>}
                    <View style={styles.bulletPoint}>
                        <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                        <Text style={[styles.bulletText, { color: Colors(theme).text }]}>
                            Metrics entered above should <Text style={{ fontWeight: '600' }}>match the uploaded screenshots</Text>. Any significant deviation may lead to <Text style={{ fontWeight: '600' }}>account deactivation</Text>.
                        </Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                        <Text style={[styles.bulletText, { color: Colors(theme).text }]}>
                            <Text style={{ fontWeight: '600' }}>Follower Range:</Text> This should match your visible follower count as seen on your profile screenshot. Avoid rounding up to the next tier.
                        </Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                        <Text style={[styles.bulletText, { color: Colors(theme).text }]}>
                            <Text style={{ fontWeight: '600' }}>Monthly View Count:</Text> Total views your content receives in the last 30 days. This can be found in your Instagram Insights.
                        </Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={[styles.bulletSymbol, { color: Colors(theme).text }]}>{'\u2022'}</Text>
                        <Text style={[styles.bulletText, { color: Colors(theme).text }]}>
                            <Text style={{ fontWeight: '600' }}>Monthly Interaction Count:</Text> Includes likes, comments, shares, and saves in the last 30 days. Check this from the post/activity insights section.
                        </Text>
                    </View>

                    {!socialId && <>
                        <Text style={[styles.notesHeading, { marginTop: 30, color: Colors(theme).text }]}>Example Screenshots</Text>
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
                    </>}
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
                    loading={apiLoading}
                    disabled={((handle.length < 1 || !profileImageUrl || !dashboardImageUrl) && !socialId) || followerRange.length == 0 || monthlyViews.length == 0 || monthlyInteractions.length == 0}>
                    Continue
                </Button>
            </View>
            {blockLoading && <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={"large"} color={Colors(theme).primary} />
            </View>}
        </AppLayout>
    );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120,
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
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    uploadBox: {
        flex: 1,
        height: 250,
        borderWidth: 1,
        borderRadius: 10,
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
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12
    },
    uploadHint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
    button: {
        paddingVertical: 8,
        marginTop: 16,
        width: '100%',
    },
    buttonText: {
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
        padding: 16,
        borderRadius: 10,
        marginTop: 30,
        marginBottom: 20,
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
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors(theme).background,
        padding: 16,
        borderTopWidth: 1,
        borderColor: Colors(theme).border,
    },
});

export default AddInstagramManual;