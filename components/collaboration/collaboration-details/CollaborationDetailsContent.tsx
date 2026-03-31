import ApplicationResponse from "@/components/application/ApplicationResponse";
import CreateCollaborationMap from "@/components/create-collaboration/CreateCollaborationMap";
import BrandInfoBorderedCard from "@/components/detail-screens/BrandInfoBorderedCard";
import CollaborationDetailMedia from "@/components/detail-screens/CollaborationDetailMedia";
import CollaborationDetailTitleBlock from "@/components/detail-screens/CollaborationDetailTitleBlock";
import { useCollaborationDetailSurfaceStyles } from "@/components/detail-screens/useCollaborationDetailSurfaceStyles";
import AuthModal from "@/components/modals/AuthModal";
import Button from "@/components/ui/button";
import { useAuthContext, useContractContext } from "@/contexts";
import { PromotionType } from "@/shared-libs/firestore/trendly-pro/constants/promotion-type";
import { CollaborationLocationType, IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IManagers } from "@/shared-libs/firestore/trendly-pro/models/managers";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import ConfirmationModal from "@/shared-uis/components/ConfirmationModal";
import ImageComponent from "@/shared-uis/components/image-component";
import RatingSection from "@/shared-uis/components/rating-section";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { Invitation } from "@/types/Collaboration";
import { Contract } from "@/types/Contract";
import { formatTimeToNow } from "@/utils/date";
import {
    faFacebook,
    faInstagram,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
    faDollarSign,
    faFilm,
    faHouseLaptop,
    faLocationDot,
    faPanorama,
    faRecordVinyl,
    faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { Card, Portal, Text } from "react-native-paper";
import { CollaborationDetail } from ".";
import ChipCard from "../card-components/ChipComponent";
import BrandModal from "./modal/BrandModal";
import ManagerModal from "./modal/ManagerModal";
interface ApplicationData extends IApplications {
    id: string;
}

interface CollaborationDetailsContentProps {
    pageID: string;
    cardType: string; // "collaboration" | "invitation" | "application" | "public-collaboration"
    collaborationDetail: CollaborationDetail;
    logo?: string;
    totalApplications: number;
    fetchCollaboration: () => void;
    applicationData?: ApplicationData;
    invitationData?: Invitation;
}

const CollaborationDetailsContent = (
    props: CollaborationDetailsContentProps
) => {
    const theme = useTheme();
    const router = useMyNavigation();
    const styles = useCollaborationDetailSurfaceStyles();
    const [status, setStatus] = React.useState("pending");
    const [managerDetails, setManagerDetails] = React.useState<any>();
    const [brandModalVisible, setBrandModalVisible] = useState(false);
    const [managerModalVisible, setManagerModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] =
        useState(false);
    const [cardType, setCardType] = useState(props.cardType);
    const [contracts, setContracts] = useState<Contract[]>([]);

    const authModalBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { user } = useAuthContext();
    const { getContractsByCollaborationId } = useContractContext();

    const fetchManagerDetails = async () => {
        const managerRef = doc(
            FirestoreDB,
            "managers",
            props.collaborationDetail.managerId
        );
        const managerDoc = await getDoc(managerRef);

        const managerBrandref = doc(
            FirestoreDB,
            "brands",
            props.collaborationDetail.brandId,
            "members",
            props.collaborationDetail.managerId
        );

        const managerBrandDoc = await getDoc(managerBrandref);

        const managerData = managerDoc.data() as IManagers;
        const managerBrandData = managerBrandDoc.data();

        setManagerDetails({
            name: managerData.name,
            email: managerData.email,
            profileImage: managerData.profileImage,
            role: managerBrandData?.role,
        });
    };

    const fetchContracts = async () => {
        const fetchedContracts = await getContractsByCollaborationId(
            props.collaborationDetail.id
        );

        setContracts(fetchedContracts);
    };

    const acceptInvitation = async () => {
        if (!props.invitationData) return;

        const invitationRef = doc(
            FirestoreDB,
            "collaborations",
            props.invitationData.collaborationId,
            "invitations",
            props.invitationData.id
        );

        await updateDoc(invitationRef, {
            status: "accepted",
        }).then(() => {
            if (!user?.id) return;

            setStatus("accepted");
            Toaster.success("Invitation accepted successfully");
            router.push(`/apply-now/${props?.invitationData?.collaborationId}`);
        });
    };

    const rejectInvitation = () => {
        if (!props.invitationData) return;

        const invitationRef = doc(
            FirestoreDB,
            "collaborations",
            props.invitationData.collaborationId,
            "invitations",
            props.invitationData.id
        );

        const updation = updateDoc(invitationRef, {
            status: "rejected",
        });

        Toaster.success("Invitation Rejected");
        props.invitationData = {
            ...props.invitationData,
            status: "rejected",
        };
        setStatus("rejected");
    };

    const withdrawApplication = () => {
        try {
            if (!props.applicationData) return;
            const applicationRef = doc(
                FirestoreDB,
                "collaborations",
                props.pageID,
                "applications",
                props?.applicationData?.id
            );
            deleteDoc(applicationRef);

            Toaster.success("Application Withdrawn Successfully");
            setCardType("collaboration");
            props.fetchCollaboration();
        } catch (e) {
            Console.error(e);
        }
    };

    const getFeedbacks = (contract: Contract[]) => {
        let feedbacks: {
            ratings?: number;
            review?: string;
        }[] = [];

        contract.forEach((contract) => {
            if (contract.feedbackFromInfluencer) {
                feedbacks.push({
                    ratings: contract.feedbackFromInfluencer.ratings,
                    review: contract.feedbackFromInfluencer.feedbackReview,
                });
            }

            if (contract.feedbackFromBrand) {
                feedbacks.push({
                    ratings: contract.feedbackFromBrand.ratings,
                    review: contract.feedbackFromBrand.feedbackReview,
                });
            }
        });

        return feedbacks;
    };

    useEffect(() => {
        fetchManagerDetails();
    }, []);

    useEffect(() => {
        fetchContracts();
    }, []);
    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Collaboration Details */}
            <View style={styles.profileCard}>
                <CollaborationDetailMedia
                    attachments={props.collaborationDetail?.attachments}
                />
                <Card.Content style={styles.profileContent}>
                    <CollaborationDetailTitleBlock
                        title={props.collaborationDetail.name}
                        timeStamp={props.collaborationDetail.timeStamp}
                        description={props.collaborationDetail.description || ""}
                        formatTimeToNow={formatTimeToNow}
                    />

                    <BrandInfoBorderedCard
                        imageUrl={props.collaborationDetail.brandImage}
                        name={props.collaborationDetail.brandName}
                        verified={props.collaborationDetail.paymentVerified}
                        description={props.collaborationDetail.brandDescription}
                        truncateAt={60}
                        header={
                            <RatingSection feedbacks={getFeedbacks(contracts)} />
                        }
                        onPressBrand={() => setBrandModalVisible(true)}
                    />

                    {cardType === "public-collaboration" && (
                        <View style={styles.publicCollabActions}>
                            <Button
                                mode="contained"
                                style={styles.fullWidthButton}
                                onPress={() => {
                                    authModalBottomSheetModalRef.current?.present();
                                }}
                            >
                                Register Now
                            </Button>
                        </View>
                    )}

                    {cardType === "collaboration" && (
                        <>
                            {props.collaborationDetail.status !== "active" && (
                                <Text style={styles.mutedCaption}>
                                    Applications are currently closed for this collaboration.{" "}
                                </Text>
                            )}
                            <Button
                                mode="contained"
                                style={styles.fullWidthButton}
                                onPress={() => {
                                    router.push(`/apply-now/${props.pageID}`);
                                }}
                                disabled={props.collaborationDetail.status != "active"}
                            >
                                Apply Now
                            </Button>
                        </>
                    )}
                    {cardType === "invitation" &&
                        props.invitationData?.status === "pending" &&
                        status === "pending" && (
                            <View style={styles.invitationActions}>
                                <Button
                                    mode="contained"
                                    style={styles.applyButton}
                                    onPress={() => {
                                        acceptInvitation();
                                    }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    mode="contained"
                                    style={styles.applyButton}
                                    onPress={() => {
                                        rejectInvitation();
                                    }}
                                >
                                    Reject
                                </Button>
                            </View>
                        )}
                    {cardType === "application" && (
                        <ApplicationResponse
                            variant="collaboration"
                            title="Your Application"
                            application={props.applicationData}
                            influencerQuestions={
                                props?.collaborationDetail?.questionsToInfluencers
                            }
                            onWithdrawPress={() => setConfirmationModalVisible(true)}
                            onEditPress={() => {
                                if (!props.applicationData?.id) return;
                                router.push({
                                    // @ts-ignore
                                    pathname: `/edit-application/${props.applicationData.id}`,
                                    params: {
                                        collaborationId:
                                            props.applicationData?.collaborationId,
                                    },
                                });
                            }}
                        />
                    )}

                    {props.collaborationDetail?.externalLinks &&
                        props.collaborationDetail?.externalLinks.length > 0 && (
                            <View style={styles.externalLinksRow}>
                                {props.collaborationDetail?.externalLinks?.map(
                                    (item, index) => (
                                        <Button
                                            key={index}
                                            mode="contained"
                                            style={styles.externalLinkButton}
                                            textColor={Colors(theme).text}
                                            onPress={() => {
                                                Linking.openURL(item.link);
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    )
                                )}
                            </View>
                        )}

                    {/* Statistics */}

                    <View style={styles.borderedSectionPad}>
                        <Text style={styles.statLabel}>
                            Influencer Needed:{" "}
                            {props.collaborationDetail.numberOfInfluencersNeeded}
                        </Text>
                        <Text style={styles.statLabel}>
                            Influencer Applied: {props.totalApplications}
                        </Text>
                        <Text style={styles.statLabel}>
                            Brand Hire Rate: 75%
                        </Text>
                        {props.collaborationDetail.promotionType ===
                            PromotionType.PAID_COLLAB && (
                                <Text style={styles.statLabel}>
                                    Budget:
                                    {props.collaborationDetail?.budget?.min ===
                                        props.collaborationDetail?.budget?.max
                                        ? `Rs. ${props.collaborationDetail?.budget?.min}`
                                        : `Rs. ${props.collaborationDetail?.budget?.min} - Rs. ${props.collaborationDetail?.budget?.max}`}
                                </Text>
                            )}
                    </View>
                    <View style={styles.chipsWrap}>
                        <ChipCard
                            chipText={
                                props.collaborationDetail.promotionType ===
                                    PromotionType.PAID_COLLAB
                                    ? "Paid"
                                    : "Barter"
                            }
                            chipIcon={faDollarSign}
                        />
                        <ChipCard
                            chipText={props.collaborationDetail.location.type}
                            chipIcon={
                                props.collaborationDetail.location.type === CollaborationLocationType.OnSite
                                    ? faLocationDot
                                    : faHouseLaptop
                            }
                        />

                        {props.collaborationDetail.platform &&
                            props.collaborationDetail.platform.map((content, index) => (
                                <ChipCard
                                    key={index}
                                    chipText={content}
                                    chipIcon={
                                        content === "Instagram"
                                            ? faInstagram
                                            : content === "Facebook"
                                                ? faFacebook
                                                : content === "Youtube"
                                                    ? faYoutube
                                                    : faInstagram
                                    }
                                />
                            ))}

                        {props.collaborationDetail.contentFormat &&
                            props.collaborationDetail.contentFormat.map((content, index) => (
                                <ChipCard
                                    key={index}
                                    chipText={content}
                                    chipIcon={
                                        content === "Posts"
                                            ? faPanorama
                                            : content === "Reels"
                                                ? faFilm
                                                : content === "Stories"
                                                    ? faHeart
                                                    : content === "Live"
                                                        ? faRecordVinyl
                                                        : content === "Product Reviews"
                                                            ? faStarHalfStroke
                                                            : faPanorama
                                    }
                                />
                            ))}
                    </View>

                    {props.collaborationDetail.location.type === CollaborationLocationType.OnSite && (
                        <View style={styles.columnFullWidth}>
                            <Text style={styles.sectionHeadingSpaced}>
                                Location
                            </Text>
                            <CreateCollaborationMap
                                mapRegion={{
                                    latitude: props.collaborationDetail?.location?.latlong?.lat,
                                    longitude: props.collaborationDetail?.location?.latlong?.long,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.042,
                                }}
                                onMapRegionChange={(region) => { }}
                                onFormattedAddressChange={(address) => { }}
                            />
                            <Text style={styles.locationBody}>
                                {props.collaborationDetail.location.name}
                            </Text>
                        </View>
                    )}
                    {props?.collaborationDetail?.questionsToInfluencers &&
                        props?.collaborationDetail?.questionsToInfluencers.length > 0 && (
                            <View style={styles.borderedSectionPad}>
                                <Text style={styles.sectionHeading}>
                                    Questions asked on application
                                </Text>

                                {props?.collaborationDetail?.questionsToInfluencers?.map(
                                    (question, index) => (
                                        <Text
                                            key={index}
                                            style={styles.questionText}
                                        >
                                            {question}
                                        </Text>
                                    )
                                )}
                            </View>
                        )}
                    <View style={styles.postedByBlock}>
                        <Text style={styles.sectionHeading}>
                            Posted by
                        </Text>
                        <Pressable onPress={() => setManagerModalVisible(true)}>
                            <View style={styles.managerRow}>
                                <ImageComponent
                                    url={managerDetails?.profileImage}
                                    shape="circle"
                                    initials={managerDetails?.name}
                                    altText="Manager Profile Image"
                                    size="small"
                                />
                                <View style={styles.managerTextCol}>
                                    <Text style={styles.managerName}>
                                        {managerDetails?.name}
                                    </Text>
                                    <Text style={styles.managerRole}>
                                        {managerDetails?.role} -{" "}
                                        {props.collaborationDetail.brandName}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </Card.Content>
            </View>
            <Portal>
                <BrandModal
                    brand={{
                        image: props.collaborationDetail.brandImage,
                        name: props.collaborationDetail.brandName,
                        description: props.collaborationDetail.brandDescription,
                        verified: props.collaborationDetail.paymentVerified,
                        website: props.collaborationDetail.brandWebsite,
                        category: props.collaborationDetail.brandCategory,
                    }}
                    visible={brandModalVisible}
                    setVisibility={setBrandModalVisible}
                />
                <ManagerModal
                    manager={{
                        email: managerDetails?.email,
                        image: managerDetails?.profileImage,
                        name: managerDetails?.name,
                    }}
                    brandDescription={props.collaborationDetail.brandDescription}
                    visible={managerModalVisible}
                    setVisibility={setManagerModalVisible}
                />
                <ConfirmationModal
                    cancelAction={() => setConfirmationModalVisible(false)}
                    confirmAction={() => {
                        setConfirmationModalVisible(false);
                        withdrawApplication();
                    }}
                    visible={confirmationModalVisible}
                    setVisible={setConfirmationModalVisible}
                    confirmText="Yes"
                    cancelText="No"
                    title="Withdraw Application"
                    description="Are you sure you want to withdraw your application?"
                />
                <AuthModal
                    bottomSheetModalRef={authModalBottomSheetModalRef as any}
                    collaborationId={props.pageID}
                />
            </Portal>
        </ScrollView>
    );
};

export default CollaborationDetailsContent;
