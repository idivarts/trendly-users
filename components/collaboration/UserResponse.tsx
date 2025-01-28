import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { FC } from "react";
import { Text, View } from "../theme/Themed";
import { Pressable, ScrollView } from "react-native";
import RenderMediaItem from "../ui/carousel/render-media-item";
import { processRawAttachment } from "@/utils/attachments";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import Button from "../ui/button";

interface UserResponseProps {
  application?: IApplications;
  influencerQuestions?: string[];
  setConfirmationModalVisible: (value: boolean) => void;
}

const UserResponse: FC<UserResponseProps> = ({
  application,
  influencerQuestions,
  setConfirmationModalVisible,
}) => {
  const attachmentFiltered = application?.attachments.map((attachment) => {
    return processRawAttachment(attachment);
  });
  const theme = useTheme();

  return (
    <View
      style={{
        borderWidth: 0.3,
        borderRadius: 5,
        width: "100%",
        padding: 10,
        borderColor: Colors(theme).gray300,
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Your Application
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable onPress={() => setConfirmationModalVisible(true)}>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Withdraw
            </Text>
          </Pressable>
          <Button
            mode="contained"
            onPress={() => {
              router.push({
                //@ts-ignore
                pathname: `/edit-application/${application?.id}`,
                params: {
                  collaborationId: application?.collaborationId,
                },
              });
            }}
          >
            Edit
          </Button>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          gap: 10,
        }}
      >
        <ScrollView horizontal style={{}}>
          {attachmentFiltered?.map((attachment, index) => (
            <RenderMediaItem
              key={index}
              item={attachment}
              index={index}
              height={100}
              width={100}
              handleImagePress={() => {}}
            />
          ))}
        </ScrollView>
        <Text style={{ fontSize: 16, marginTop: 10 }}>
          {application?.message}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            Quote: {application?.quotation || "N/A"}
          </Text>
          {application?.timeline ? (
            <Text style={{ fontSize: 16 }}>
              Timeline:{" "}
              {new Date(application?.timeline).toLocaleDateString() || "N/A"}
            </Text>
          ) : null}
        </View>
        {application?.fileAttachments &&
          application.fileAttachments.map((attachment, index) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <FontAwesomeIcon icon={faPaperclip} />
                <Text
                  key={index}
                  style={{
                    fontSize: 16,
                    width: "95%",
                  }}
                >
                  {attachment.name}
                </Text>
              </View>
            );
          })}

        <View
          style={{
            flexDirection: "column",
            gap: 10,
          }}
        >
          {application?.answersFromInfluencer
            ? influencerQuestions &&
              application?.answersFromInfluencer.map((answer, index) => {
                return (
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {influencerQuestions[answer.question]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {answer.answer}
                    </Text>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    </View>
  );
};

export default UserResponse;
