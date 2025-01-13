import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Card, Portal } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { stylesFn } from "@/styles/CollaborationDetails.styles";
import Colors from "@/constants/Colors";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { processRawAttachment } from "@/utils/attachments";
import {
  IApplications,
  ICollaboration,
} from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import UserResponse from "@/components/contract-card/UserResponse";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import ActionContainer from "./ActionContainer";
import { IContracts } from "@/shared-libs/firestore/trendly-pro/models/contracts";
import MemberContainer from "./MemberContainer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import FeedbackModal from "./FeedbackModal";
import ReviseQuotationModal from "./ReviseQuotationModal";
import { useLocalSearchParams } from "expo-router";
import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import { doc, getDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import ImageComponent from "@/shared-uis/components/image-component";
import { formatTimeToNow } from "@/utils/date";

export interface Application extends IApplications {
  id: string;
}

interface CollaborationDetailsContentProps {
  collaborationDetail: ICollaboration;
  applicationData?: Application;
  userData: IUsers;
  contractData: IContracts;
  refreshData: () => void;
}

const ContractDetailsContent = (props: CollaborationDetailsContentProps) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [membersInContract, setMembersInContract] = useState<any[]>([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const [brandData, setBrandData] = useState<IBrands>();

  const fetchBrandData = async () => {
    const brandRef = doc(
      FirestoreDB,
      "brands",
      props.collaborationDetail.brandId
    );
    const brandData = await getDoc(brandRef);
    setBrandData(brandData.data() as IBrands);
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
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Collaboration Details */}
      <View style={styles.profileCard}>
        {props?.collaborationDetail?.attachments &&
          props?.collaborationDetail?.attachments.length > 0 && (
            <Carousel
              theme={theme}
              data={
                props?.collaborationDetail?.attachments?.map((attachment) =>
                  processRawAttachment(attachment)
                ) || []
              }
            />
          )}
        <Card.Content style={styles.profileContent}>
          {/* About Collaboration */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text variant="headlineMedium" style={styles.name}>
                {props.collaborationDetail.name}
              </Text>
              {props.collaborationDetail.timeStamp ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors(theme).text,
                    paddingRight: 8,
                  }}
                >
                  {formatTimeToNow(props.collaborationDetail.timeStamp)}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors(theme).gray100,
                  marginTop: 10,
                }}
              >
                {props.collaborationDetail.description}
              </Text>
            </View>
          </View>

          <ActionContainer
            contract={props.contractData}
            refreshData={props.refreshData}
            showQuotationModal={() => setShowQuotationModal(true)}
            feedbackModalVisible={() => setFeedbackModalVisible(true)}
            userData={props.userData}
          />

          <MemberContainer
            channelId={props.contractData.streamChannelId}
            setMembersFromBrand={setMembersInContract}
          />

          <UserResponse
            application={props.applicationData}
            influencerQuestions={
              props?.collaborationDetail?.questionsToInfluencers
            }
            setConfirmationModalVisible={() => { }}
          />
          <View
            style={{
              width: "100%",
              borderWidth: 0.3,
              padding: 10,
              borderRadius: 10,
              borderColor: Colors(theme).gray300,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexGrow: 1,
              }}
            >
              <ImageComponent
                url={brandData?.image || ""}
                altText="Brand Image"
                shape="square"
                style={{ width: 40, height: 40, borderRadius: 5 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Colors(theme).text,
                  }}
                >
                  {brandData?.name}{" "}
                  {brandData?.paymentMethodVerified && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color={Colors(theme).primary}
                    />
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    flexWrap: "wrap",
                    overflow: "hidden",
                    lineHeight: 22,
                    color: Colors(theme).text,
                  }}
                >
                  {brandData?.profile?.about}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </View>
      <ReviseQuotationModal
        application={props.applicationData}
        onDismiss={() => setShowQuotationModal(false)}
        visible={showQuotationModal}
        contractId={props.contractData.streamChannelId}
        refreshData={props.refreshData}
      />
      {props.contractData.status === 2 && (
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
      )}
    </ScrollView>
  );
};

export default ContractDetailsContent;
