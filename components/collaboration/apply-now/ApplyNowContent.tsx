import Button from "@/components/ui/button";
import ListItem from "@/components/ui/list-item/ListItem";
import { AWSProgressUpdateSubject } from "@/shared-libs/contexts/aws-context.provider";
import ProgressLoader from "@/shared-uis/components/ProgressLoader";
import { Text, View } from "@/shared-uis/components/theme/Themed";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faClapperboard, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
    Card,
    HelperText,
    IconButton,
    List,
    Paragraph,
    TextInput,
} from "react-native-paper";

interface IProps {
    note: string;
    quotation: number | undefined;
    questions: string[];
    answers: { [key: string]: string };
    attachmentLength: number;

    setNote: Function;
    setQuotation: Function;
    setAnswers: Function;

    errorMessage?: string;
    loading?: boolean;

    submitText?: string;
    handleSubmit: Function;
    handleAssetUpload: Function;

    FileRenderComponent: any;
}

const ApplyNowContent = (props: IProps) => {
    const colors = Colors(useTheme());
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                nestedScrollEnabled
            >
                {props.attachmentLength === 0 ? (
                    <Card
                        style={styles.card}
                        onPress={() => props.handleAssetUpload()}
                    >
                        <Card.Content style={styles.cardContent}>
                            <IconButton
                                icon={() => (
                                    <FontAwesomeIcon
                                        color={colors.primary}
                                        icon={faClapperboard}
                                        size={36}
                                    />
                                )}
                                size={40}
                                style={styles.uploadIcon}
                            />
                            <Paragraph style={styles.cardParagraph}>
                                Upload Photos/Videos or any Sample work that might
                                match with this brand's campaign
                            </Paragraph>
                        </Card.Content>
                    </Card>
                ) : (
                    props.FileRenderComponent
                )}
                <View>
                    <TextInput
                        style={styles.noteInput}
                        activeOutlineColor={colors.primary}
                        label="Add a short note"
                        mode="outlined"
                        multiline
                        onChangeText={(text) => props.setNote(text)}
                        placeholderTextColor={colors.textSecondary}
                        textColor={colors.text}
                        value={props.note}
                    />
                    <HelperText type="info" style={styles.helperText}>
                        Write a short note to the brand about why you are interested
                        in this
                    </HelperText>

                    <List.Section>
                        <ListItem
                            title="Your Quote"
                            small
                            leftIcon={faDollarSign}
                            content={
                                props.quotation === undefined
                                    ? "(Required)"
                                    : "Rs. " + props.quotation
                            }
                            rightContent
                            onAction={() => props.setQuotation()}
                        />
                        {props.questions.length > 0 && (
                            <View style={styles.questionsSection}>
                                <Text style={styles.questionsTitle}>
                                    Questions asked by the brand
                                </Text>
                                <Text style={styles.questionsSubtitle}>
                                    These questions are optional, but we recommend you
                                    answer them thoughtfully. Brands consider your
                                    responses while shortlisting influencers.
                                </Text>
                            </View>
                        )}
                        {props.questions.map((question, index) => (
                            <ListItem
                                key={index}
                                small
                                title={question}
                                leftIcon={faCircleQuestion}
                                content={props.answers[index] || ""}
                                onAction={() => props.setAnswers(question, index)}
                            />
                        ))}
                    </List.Section>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {props.errorMessage ? (
                    <HelperText type="error" style={styles.errorText}>
                        {props.errorMessage}
                    </HelperText>
                ) : null}
                {props.loading && (
                    <ProgressLoader
                        isProcessing={props.loading}
                        progress={0}
                        subject={AWSProgressUpdateSubject}
                    />
                )}
                <Button
                    mode="contained"
                    onPress={async () => {
                        if (!props.note || props.note.length === 0) {
                            Toaster.error("Please add a note");
                            return;
                        }
                        if (props.attachmentLength === 0) {
                            Toaster.error(
                                "Please upload photos/videos on your application"
                            );
                            return;
                        }
                        if (props.quotation === undefined) {
                            Toaster.error(
                                "Please fill out your quotation",
                                "If its Barter, type quotation as 0"
                            );
                            return;
                        }
                        await props.handleSubmit();
                    }}
                    loading={props.loading}
                >
                    {props.loading
                        ? "Uploading Assets"
                        : props.submitText || "Preview Application"}
                </Button>
            </View>
        </>
    );
};

export default ApplyNowContent;

function createStyles(c: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: c.background,
            paddingHorizontal: 16,
        },
        contentContainer: {
            paddingBottom: 40,
            paddingTop: 16,
            gap: 16,
        },
        card: {
            backgroundColor: c.card,
            borderRadius: 8,
            padding: 16,
            elevation: 3,
        },
        cardContent: {
            alignItems: "center",
        },
        cardParagraph: {
            textAlign: "center",
            color: c.text,
        },
        uploadIcon: {
            alignSelf: "center",
        },
        noteInput: {
            backgroundColor: c.background,
        },
        helperText: {
            paddingHorizontal: 2,
            color: c.text,
        },
        questionsSection: {
            marginTop: 32,
        },
        questionsTitle: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 4,
            color: c.text,
        },
        questionsSubtitle: {
            fontSize: 13,
            color: c.textSecondary,
            marginBottom: 16,
        },
        footer: {
            paddingHorizontal: 16,
            paddingBottom: 8,
        },
        errorText: {
            marginBottom: 12,
            textAlign: "center",
        },
    });
}
