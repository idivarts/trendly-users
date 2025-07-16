import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { User } from "@/types/User";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
// import InfluencerCard from "../InfluencerCard";
import { View } from "../theme/Themed";


import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";

import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useInfiniteScroll } from "@/shared-libs/utils/infinite-scroll";
import BottomSheetScrollContainer from "@/shared-uis/components/bottom-sheet/scroll-view";
import { APPROX_CARD_HEIGHT } from "@/shared-uis/components/carousel/carousel-util";
import InfluencerCard from "@/shared-uis/components/InfluencerCard";
import { CarouselInViewProvider } from "@/shared-uis/components/scroller/CarouselInViewContext";
import CarouselScroller from "@/shared-uis/components/scroller/CarouselScroller";
import Colors from "@/shared-uis/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, documentId, getDoc, orderBy, query, where } from "firebase/firestore";
import { Button } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfluencerActionModal from "./InfluencerActionModal";
import InfluencerConnectModal from "./InfluencerConnectModal";
import IntroductoryModal from "./IntroductoryModal";

const ExploreInfluencers = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [introductionVisible, setIntroductionVisible] = useState(false)
    const [connectionModal, setConnectionModal] = useState(false)
    const ToggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const [influencers, setInfluencers] = useState<User[]>([]);
    const [filteredInfluencers, setFilteredInfluencers] = useState<User[]>([]);
    const [selectedInfluencer, setSelectedInfluencer] = useState<User | null>(
        null
    );

    const getInfluencer = async (influencerId: string) => {
        const influencerRef = doc(collection(FirestoreDB, "users"), influencerId);
        const influencerDoc = await getDoc(influencerRef)
        const influencer: User = {
            ...influencerDoc.data() as IUsers,
            id: influencerDoc.id
        }
        setSelectedInfluencer(influencer)
        setOpenProfileModal(true)
    }
    const { influencerId } = useLocalSearchParams()
    useEffect(() => {
        if (!influencerId)
            return;
        getInfluencer(influencerId as string)
    }, [influencerId])

    useEffect(() => {
        setIntroductionVisible(true)
    }, [])

    // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    // const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
    const [openProfileModal, setOpenProfileModal] = useState(false)

    const insets = useSafeAreaInsets();
    const containerOffset = useSharedValue({
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
    });

    // const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuthContext()
    const theme = useTheme();

    const { xl } = useBreakpoints();

    const influencersRef = collection(FirestoreDB, "users");
    const q = query(
        influencersRef,
        where("profile.completionPercentage", ">=", 60),
        ...((user?.moderations?.blockedInfluencers || []).length > 0 ? [where(documentId(), "not-in", user?.moderations?.blockedInfluencers)] : []),
        ...((user?.moderations?.reportedInfluencers || []).length > 0 ? [where(documentId(), "not-in", user?.moderations?.reportedInfluencers)] : []),
        ...((user?.connectedInfluencers || []).length > 0 ? [where(documentId(), "not-in", user?.connectedInfluencers)] : []),
        orderBy("lastUseTime", "desc")
    );

    const { loading: isLoading, data, loadMore } = useInfiniteScroll<User>(q, 10)

    useEffect(() => {
        const fetchedInfluencers: User[] = [];
        data.forEach((doc) => {
            const inf = doc
            if (inf.primarySocial)
                fetchedInfluencers.push({
                    ...inf,
                    id: doc.documentId,
                } as User);
        });
        setInfluencers(fetchedInfluencers);
    }, [data])

    const filterInfluencers = () => {
        const newFilteredInfluencers = influencers.filter((influencer) => {
            if (user?.moderations?.blockedInfluencers?.includes(influencer.id))
                return false
            if (user?.moderations?.reportedInfluencers?.includes(influencer.id))
                return false
            if (user?.connectedInfluencers?.includes(influencer.id))
                return false
            return true
        });

        setFilteredInfluencers(newFilteredInfluencers);
    };

    useEffect(() => {
        filterInfluencers();
    }, [
        influencers,
        user
    ]);

    if (isLoading && influencers.length == 0) {
        return (
            <AppLayout>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color={Colors(theme).primary} />
                </View>
            </AppLayout>
        );
    }

    const width = Math.min(MAX_WIDTH_WEB, Dimensions.get('window').width);
    const height = Math.min(APPROX_CARD_HEIGHT, Dimensions.get('window').height);

    return (
        <AppLayout>
            <View
                style={{
                    flex: 1,
                    marginHorizontal: "auto",
                    width: "100%", //xl ? MAX_WIDTH_WEB :
                }}
            >
                <View style={{ alignSelf: "stretch" }}>
                    <CarouselInViewProvider>
                        <CarouselScroller
                            data={filteredInfluencers}
                            renderItem={({ item, index }) => (
                                <InfluencerCard
                                    xl={xl}
                                    key={item.id}
                                    type="explore"
                                    ToggleModal={ToggleModal}
                                    influencer={item}
                                    style={{ marginBottom: 32 }}
                                    setSelectedInfluencer={setSelectedInfluencer as any}
                                    cardActionNode={<Button mode="outlined" onPress={() => {
                                        setSelectedInfluencer(item as User);
                                        setConnectionModal(true);
                                    }}>Add to Connections</Button>}
                                    openProfile={(item) => {
                                        if (item)
                                            setSelectedInfluencer(item as User);
                                        setOpenProfileModal(true)
                                    }}
                                />
                            )}
                            objectKey='id'
                            vertical={false}
                            width={width} // Default width if not provided
                            height={height}
                            onLoadMore={() => loadMore()}
                            onPressView={(item, ind) => {
                                if (item)
                                    setSelectedInfluencer(item as User);
                                setOpenProfileModal(true)
                            }}
                        />
                    </CarouselInViewProvider>
                </View>
            </View>

            <InfluencerActionModal influencerId={selectedInfluencer?.id} isModalVisible={isModalVisible} openProfile={() => setOpenProfileModal(true)} toggleModal={ToggleModal} />

            <BottomSheetScrollContainer
                isVisible={openProfileModal}
                snapPointsRange={["90%", "90%"]}
                onClose={() => { setOpenProfileModal(false) }}
            >
                <ProfileBottomSheet
                    influencer={selectedInfluencer as User}
                    theme={theme}
                    actionCard={
                        <View
                            style={{
                                backgroundColor: Colors(theme).transparent,
                                marginHorizontal: 16,
                            }}
                        >
                            <Button onPress={() => {
                                setOpenProfileModal(false);
                                setConnectionModal(true);
                            }}>Connect to Influencer</Button>
                            {/* <InfluencerInvite selectedInfluencer={selectedInfluencer as User} /> */}
                        </View>
                    }
                    FireStoreDB={FirestoreDB}
                    isBrandsApp={true}
                    closeModal={() => setOpenProfileModal(false)}
                />
            </BottomSheetScrollContainer>
            {introductionVisible && <IntroductoryModal isOpen={introductionVisible} onClose={() => setIntroductionVisible(false)} />}
            {(connectionModal && selectedInfluencer) && <InfluencerConnectModal influencer={selectedInfluencer} onClose={() => setConnectionModal(false)} />}
        </AppLayout>
    );
};

export default ExploreInfluencers;
