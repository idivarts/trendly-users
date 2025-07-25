import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { User } from "@/types/User";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
// import InfluencerCard from "../InfluencerCard";
import { Text, View } from "../theme/Themed";


import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";

import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { useInfiniteIdScroll } from "@/shared-libs/utils/infinite-id-scroll";
import { PersistentStorage } from "@/shared-libs/utils/persistent-storage";
import BottomSheetScrollContainer from "@/shared-uis/components/bottom-sheet/scroll-view";
import { APPROX_CARD_HEIGHT } from "@/shared-uis/components/carousel/carousel-util";
import InfluencerCard from "@/shared-uis/components/InfluencerCard";
import { CarouselInViewProvider } from "@/shared-uis/components/scroller/CarouselInViewContext";
import CarouselScroller from "@/shared-uis/components/scroller/CarouselScroller";
import SlowLoader from "@/shared-uis/components/SlowLoader";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { Button } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfluencerActionModal from "./InfluencerActionModal";
import InfluencerConnectModal from "./InfluencerConnectModal";

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
    const [influencerIds, setInfluencerIds] = useState<string[]>([])

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

    const openIntroductoryModal = async () => {
        let x = await PersistentStorage.get("influencers-introductory-modal")
        if (!x) {
            setIntroductionVisible(true)
            PersistentStorage.set("influencers-introductory-modal", "true")
        }
    }
    useEffect(() => {
        openIntroductoryModal()
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
    );

    // const { loading: isLoading, data, loadMore } = useInfiniteScroll<User>(q, 10)
    const idsToIgnore = [...(user?.connectedInfluencers || []), ...(user?.moderations?.blockedInfluencers || []), ...(user?.moderations?.reportedInfluencers || []), ...(user?.id ? [user.id] : [])]

    const { loading: isLoading, data, loadMore } = useInfiniteIdScroll<User>(influencerIds, q, 5)

    const loadInfluencerIds = async () => {
        const influencerIds: string[] = await PersistentStorage.getItemWithExpiry("matchmaking_influencers")
        if (influencerIds) {
            setInfluencerIds(influencerIds.filter((id) => !idsToIgnore.includes(id)))
        } else
            HttpWrapper.fetch(`/api/matchmaking/influencer-for-influencer`, {
                method: "GET",
            }).then(async (res) => {
                const body = await res.json()
                let influencerIds: string[] = []
                if (__DEV__) {
                    influencerIds = ["MvLmVKwUcXXZXfBfQHSnq5udnaO2", "mmUwj1YlPUVn0h2hlN4qVw1bEZo1", "jEZf51INayY4ZcJs2ck0XWR8Ptj2", ...body.influencers as string[]]
                } else {
                    influencerIds = body.influencers as string[]
                }
                setInfluencerIds(influencerIds.filter((id) => !idsToIgnore.includes(id)))
                PersistentStorage.setItemWithExpiry("matchmaking_influencers", influencerIds)
            }).catch(e => {
                Toaster.error("Cant fetch Influencers")
            })
    }

    useEffect(() => {
        loadInfluencerIds()
    }, [])
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
                    <SlowLoader />
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
                                    type="influencers"
                                    ToggleModal={ToggleModal}
                                    influencer={item}
                                    style={{ marginBottom: 32 }}
                                    setSelectedInfluencer={setSelectedInfluencer as any}
                                    cardActionNode={<Button mode="contained" onPress={() => {
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
                    showCampaignGoals={false}
                    showInfluencerGoals={true}
                    actionCard={
                        <View
                            style={{
                                backgroundColor: Colors(theme).transparent,
                                marginHorizontal: 16,
                                paddingVertical: 16
                            }}
                        >
                            <Text style={{ paddingVertical: 16 }}>
                                You can discover and connect with other influencers who are in a similar stage as you — based on follower count, reach, or engagement. Feel free to connect for content collaborations or simply to expand your network.
                            </Text>
                            <Button mode="contained" onPress={() => {
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
            {/* {introductionVisible && <IntroductoryModal isOpen={introductionVisible} onClose={() => setIntroductionVisible(false)} />} */}
            {(connectionModal && selectedInfluencer) && <InfluencerConnectModal influencer={selectedInfluencer} onClose={() => setConnectionModal(false)} />}
        </AppLayout>
    );
};

export default ExploreInfluencers;
