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
import { formatTimeToNow } from "@/utils/date";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Portal } from "react-native-paper";
import FeedbackModal from "./FeedbackModal";
import InfluencerContractActions from "./InfluencerContractActions";
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
    const [, setMembersInContract] = useState<any[]>([]);
    const [showQuotationModal, setShowQuotationModal] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const params = useLocalSearchParams();
    const [brandData, setBrandData] = useState<IBrands>();

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

                    <InfluencerContractActions
                        contract={props.contractData}
                        collaborationData={props.collaborationDetail}
                        userData={props.userData}
                        refreshData={props.refreshData}
                        showQuotationModal={() => setShowQuotationModal(true)}
                        feedbackModalVisible={() => setFeedbackModalVisible(true)}
                    />

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
                        description={brandData?.profile?.about || ""}
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
            <Portal>
                <FeedbackModal
                        feedbackGiven={
                            props.contractData.feedbackFromInfluencer?.feedbackReview
                                ? true
                                : false
                        }
                        setVisibility={() => setFeedbackModalVisible(false)}
                        star={props.contractData.feedbackFromInfluencer?.ratings || 0}
                        visible={feedbackModalVisible}
                        contract={props.contractData}
                        refreshData={props.refreshData}
                    />
            </Portal>
        </IOScroll>
    );
};

export default ContractDetailsContent;
