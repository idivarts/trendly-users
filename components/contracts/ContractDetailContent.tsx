import ApplicationResponse from "@/components/application/ApplicationResponse";
import BrandInfoBorderedCard from "@/components/detail-screens/BrandInfoBorderedCard";
import CollaborationDetailMedia from "@/components/detail-screens/CollaborationDetailMedia";
import CollaborationDetailTitleBlock from "@/components/detail-screens/CollaborationDetailTitleBlock";
import { useCollaborationDetailSurfaceStyles } from "@/components/detail-screens/useCollaborationDetailSurfaceStyles";
import { IOScroll } from "@/shared-libs/contexts/scroll-context";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import {
    IApplications,
    ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useMyNavigation } from "@/shared-libs/utils/router";
import { Stars } from "@/shared-uis/components/rating-section";
import Colors from "@/shared-uis/constants/Colors";
import { formatTimeToNow } from "@/utils/date";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import ActionContainer from "./ActionContainer";
import FeedbackModal from "./FeedbackModal";
import MemberContainer from "./MemberContainer";
import ReviseQuotationModal from "./ReviseQuotationModal";

export interface Application extends IApplications {
    id: string;
}

interface ContractDetailViewProps {
    collaborationDetail: ICollaboration;
    applicationData?: Application;
    userData: IUsers;
    contractData: IContracts;
    refreshData: () => void;
}

const ContractDetailsContent = (props: ContractDetailViewProps) => {
    const styles = useCollaborationDetailSurfaceStyles();
    const [membersInContract, setMembersInContract] = useState<any[]>([]);
    const [showQuotationModal, setShowQuotationModal] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const params = useLocalSearchParams();
    const [brandData, setBrandData] = useState<IBrands>();
    const router = useMyNavigation();
    const theme = useTheme();
    const colors = Colors(theme);
    const localStyles = useMemo(() => createLocalStyles(colors), [colors]);

    const { giveFeedback } = useLocalSearchParams();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (giveFeedback && isFocused) {
            setFeedbackModalVisible(true);
        }
    }, [giveFeedback, isFocused]);

    const fetchBrandData = async () => {
        const brandRef = doc(
            FirestoreDB,
            "brands",
            props.collaborationDetail.brandId
        );
        const brandSnapshot = await getDoc(brandRef);
        setBrandData(brandSnapshot.data() as IBrands);
    };

    useEffect(() => {
        if (params.showModal === "true") {
            setShowQuotationModal(true);
        }
    }, [params.showModal]);

    useEffect(() => {
        fetchBrandData();
    }, []);

    const influencerFeedbackSubmitted = Boolean(props.contractData.feedbackFromInfluencer?.timeSubmitted) ||
        Boolean(props.contractData.feedbackFromInfluencer?.feedbackReview);
    const brandFeedback = props.contractData.feedbackFromBrand;
    const brandFeedbackSubmitted = Boolean(brandFeedback?.timeSubmitted) || Boolean(brandFeedback?.feedbackReview);
    const influencerFeedback = props.contractData.feedbackFromInfluencer;

    const brandFeedbackAuthorName = useMemo(() => {
        const managerId = brandFeedback?.managerId || props.contractData.managerId;
        if (!managerId) return "Brand";
        const manager = membersInContract.find((m) => m?.managerId === managerId);
        return manager?.name || "Brand";
    }, [brandFeedback?.managerId, membersInContract, props.contractData.managerId]);

    return (
        <IOScroll
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.profileCard}>
                <CollaborationDetailMedia
                    attachments={props.collaborationDetail?.attachments}
                    mediaWrapStyle={styles.mediaWrap}
                />
                <Card.Content style={styles.profileContent}>
                    <CollaborationDetailTitleBlock
                        title={props.collaborationDetail.name}
                        timeStamp={props.collaborationDetail.timeStamp}
                        description={props.collaborationDetail.description || ""}
                        formatTimeToNow={formatTimeToNow}
                    />

                    <ActionContainer
                        contract={props.contractData}
                        refreshData={props.refreshData}
                        showQuotationModal={() => setShowQuotationModal(true)}
                        feedbackModalVisible={() => setFeedbackModalVisible(true)}
                        userData={props.userData}
                        collaborationData={props.collaborationDetail}
                    />

                    {influencerFeedbackSubmitted || brandFeedbackSubmitted ? (
                        <View style={localStyles.feedbackSection}>
                            {brandFeedbackSubmitted ? (
                                <View style={localStyles.feedbackCard}>
                                    <Text style={localStyles.feedbackTitle}>Brand Feedback</Text>
                                    <Text style={localStyles.feedbackByline}>By {brandFeedbackAuthorName}</Text>
                                    <View style={localStyles.feedbackRow}>
                                        <Stars rating={brandFeedback?.ratings || 0} size={16} />
                                        {typeof brandFeedback?.ratings === "number" ? (
                                            <Text style={localStyles.feedbackMeta}>
                                                {brandFeedback.ratings.toFixed(1)}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {brandFeedback?.feedbackReview ? (
                                        <Text style={localStyles.feedbackBody}>{brandFeedback.feedbackReview}</Text>
                                    ) : null}
                                </View>
                            ) : null}

                            {influencerFeedbackSubmitted ? (
                                <View style={localStyles.feedbackCard}>
                                    <Text style={localStyles.feedbackTitle}>Your Feedback</Text>
                                    <Text style={localStyles.feedbackByline}>By {props.userData?.name || "You"}</Text>
                                    <View style={localStyles.feedbackRow}>
                                        <Stars rating={influencerFeedback?.ratings || 0} size={16} />
                                        {typeof influencerFeedback?.ratings === "number" ? (
                                            <Text style={localStyles.feedbackMeta}>
                                                {influencerFeedback.ratings.toFixed(1)}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {influencerFeedback?.feedbackReview ? (
                                        <Text style={localStyles.feedbackBody}>
                                            {influencerFeedback.feedbackReview}
                                        </Text>
                                    ) : null}
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    <MemberContainer
                        channelId={props.contractData.streamChannelId}
                        setMembersFromBrand={setMembersInContract}
                    />

                    <ApplicationResponse
                        variant="plain"
                        title="Application"
                        application={props.applicationData}
                        influencerQuestions={
                            props?.collaborationDetail?.questionsToInfluencers
                        }
                    />

                    <BrandInfoBorderedCard
                        plainBody
                        imageUrl={brandData?.image || ""}
                        name={brandData?.name || ""}
                        verified={brandData?.paymentMethodVerified}
                        description={
                            props.collaborationDetail.description ||
                            brandData?.profile?.about ||
                            ""
                        }
                        descriptionNumberOfLines={2}
                        onPressBrand={() =>
                            router.push(
                                `/collaboration-details/${props.contractData.collaborationId}`
                            )
                        }
                    />
                </Card.Content>
            </View>
            <ReviseQuotationModal
                application={props.applicationData}
                onDismiss={() => setShowQuotationModal(false)}
                visible={showQuotationModal}
                contractId={props.contractData.streamChannelId}
                refreshData={props.refreshData}
            />
            <FeedbackModal
                feedbackGiven={
                    props.contractData.feedbackFromInfluencer?.feedbackReview ? true : false
                }
                setVisibility={() => setFeedbackModalVisible(false)}
                star={props.contractData.feedbackFromInfluencer?.ratings || 0}
                visible={feedbackModalVisible}
                contract={props.contractData}
                refreshData={props.refreshData}
            />
        </IOScroll>
    );
};

export default ContractDetailsContent;

function createLocalStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        feedbackSection: {
            width: "100%",
            alignSelf: "stretch",
            gap: 12,
            marginTop: 12,
        },
        feedbackCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 14,
            width: "100%",
            alignSelf: "stretch",
        },
        feedbackTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 4,
        },
        feedbackByline: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: "600",
            marginBottom: 8,
        },
        feedbackRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
        },
        feedbackMeta: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: "600",
        },
        feedbackBody: {
            color: colors.text,
            fontSize: 14,
            lineHeight: 20,
        },
    });
}
