import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import RenderMediaItem from "@/shared-uis/components/carousel/render-media-item";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { ScrollView } from "react-native";
import { Text, View } from "../theme/Themed";

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
                borderRadius: 5,
                width: "100%",
                gap: 16,
                backgroundColor: "transparent",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "transparent",
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                    }}
                >
                    Application
                </Text>
            </View>
            <View
                style={{
                    width: "100%",
                    gap: 16,
                    backgroundColor: "transparent",
                }}
            >
                <ScrollView horizontal>
                    {attachmentFiltered?.map((attachment, index) => (
                        <RenderMediaItem
                            key={index}
                            item={attachment}
                            index={index}
                            height={100}
                            width={100}
                            handleImagePress={() => { }}
                        />
                    ))}
                </ScrollView>

                <View style={{ backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: 16 }}>{application?.message}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "space-between",
                        backgroundColor: "transparent",
                    }}
                >
                    <View style={{ backgroundColor: "transparent" }}>
                        <Text style={{ fontSize: 16 }}>
                            Quote: {application?.quotation || "Free"}
                        </Text>
                    </View>
                    {/* {application?.timeline && (
            <Text style={{ fontSize: 16 }}>
              Timeline:{" "}
              {new Date(application?.timeline).toLocaleDateString() || "N/A"}
            </Text>
          )} */}
                </View>
                {/* {application?.fileAttachments &&
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
                  style={{
                    fontSize: 16,
                  }}
                >
                  {attachment.name}
                </Text>
              </View>
            );
          })} */}

                <View
                    style={{
                        flexDirection: "column",
                        gap: 10,
                        backgroundColor: "transparent",
                    }}
                >
                    {application?.answersFromInfluencer &&
                        influencerQuestions &&
                        application?.answersFromInfluencer.map((answer, index) => {
                            return (
                                <View
                                    key={index}
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
                                        Q{") "}
                                        {influencerQuestions[answer.question]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                        }}
                                    >
                                        A{") "}
                                        {answer.answer}
                                    </Text>
                                </View>
                            );
                        })}
                </View>
            </View>
        </View>
    );
};

export default UserResponse;
