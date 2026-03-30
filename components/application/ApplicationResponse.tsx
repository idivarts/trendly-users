import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useBreakpoints } from "@/hooks";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import ScrollMedia from "@/shared-uis/components/carousel/scroll-media";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { FC, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";

import Button from "../ui/button";
import { Text, View } from "../theme/Themed";

export type ApplicationResponseVariant = "collaboration" | "plain";

export interface ApplicationResponseProps {
    application?: IApplications;
    influencerQuestions?: string[];
    title?: string;
    variant?: ApplicationResponseVariant;
    onWithdrawPress?: () => void;
    onEditPress?: () => void;
}

const ApplicationResponse: FC<ApplicationResponseProps> = ({
    application,
    influencerQuestions,
    title = "Application",
    variant = "plain",
    onWithdrawPress,
    onEditPress,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { xl } = useBreakpoints();

    const attachmentFiltered = useMemo(() => {
        return application?.attachments?.map((attachment) =>
            processRawAttachment(attachment)
        );
    }, [application]);

    const answers = application?.answersFromInfluencer;

    return (
        <View
            style={[
                styles.containerBase,
                variant === "collaboration" ? styles.containerWithBorder : null,
            ]}
        >
            <View style={styles.headerRow}>
                <Text style={styles.titleText}>{title}</Text>

                {(onWithdrawPress || onEditPress) && (
                    <View style={styles.actionsRow}>
                        {onWithdrawPress && (
                            <Pressable onPress={onWithdrawPress}>
                                <Text style={styles.actionText}>Withdraw</Text>
                            </Pressable>
                        )}

                        {onEditPress && (
                            <Button mode="contained" onPress={onEditPress}>
                                Edit
                            </Button>
                        )}
                    </View>
                )}
            </View>

            {attachmentFiltered && attachmentFiltered.length > 0 && (
                <ScrollMedia
                    MAX_WIDTH_WEB={MAX_WIDTH_WEB}
                    media={attachmentFiltered}
                    xl={xl}
                    theme={theme}
                    padding={5}
                />
            )}

            {application?.message ? (
                <Text style={styles.messageText}>{application.message}</Text>
            ) : null}

            <Text style={styles.quoteText}>
                Quote:{" "}
                {application?.quotation != null ? application.quotation : "Free"}
            </Text>

            {answers && influencerQuestions
                ? answers.map((answer, index) => {
                      const questionText = influencerQuestions[answer.question];

                      if (!questionText) return null;

                      return (
                          <View key={index} style={styles.answerBlock}>
                              <Text style={styles.questionText}>
                                  Q) {questionText}
                              </Text>
                              <Text style={styles.answerText}>
                                  A) {answer.answer}
                              </Text>
                          </View>
                      );
                  })
                : null}
        </View>
    );
};

export default ApplicationResponse;

const createStyles = (colors: ReturnType<typeof Colors>) =>
    StyleSheet.create({
        containerBase: {
            width: "100%",
            borderRadius: 5,
            gap: 16,
            backgroundColor: colors.transparent,
        },
        containerWithBorder: {
            borderWidth: 0.3,
            borderColor: colors.gray300,
            padding: 10,
            gap: 10,
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        titleText: {
            fontSize: 16,
            fontWeight: "bold",
            color: colors.text,
        },
        actionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
        },
        actionText: {
            fontSize: 16,
            color: colors.text,
        },
        messageText: {
            fontSize: 16,
            color: colors.text,
        },
        quoteText: {
            fontSize: 16,
            color: colors.text,
        },
        answerBlock: {
            flexDirection: "column",
            gap: 10,
        },
        questionText: {
            fontSize: 16,
            fontWeight: "bold",
            color: colors.text,
        },
        answerText: {
            fontSize: 16,
            color: colors.text,
        },
    });

