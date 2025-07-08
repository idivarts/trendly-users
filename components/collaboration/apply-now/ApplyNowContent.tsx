import Button from '@/components/ui/button';
import ListItem from '@/components/ui/list-item/ListItem';
import { AWSProgressUpdateSubject } from '@/shared-libs/contexts/aws-context.provider';
import ProgressLoader from '@/shared-uis/components/ProgressLoader';
import { Text, View } from '@/shared-uis/components/theme/Themed';
import Toaster from '@/shared-uis/components/toaster/Toaster';
import Colors from '@/shared-uis/constants/Colors';
import { stylesFn } from "@/styles/ApplyNow.styles";
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faClapperboard, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { Card, HelperText, IconButton, List, Paragraph, TextInput } from 'react-native-paper';

interface IProps {
    note: string,
    quotation: number | undefined,
    questions: string[]
    answers: { [key: string]: string }
    attachmentLength: number,

    setNote: Function,
    setQuotation: Function,
    setAnswers: Function

    errorMessage?: string
    loading?: boolean

    submitText?: string
    handleSubmit: Function
    handleAssetUpload: Function

    FileRenderComponent: any
}

const ApplyNowContent = (props: IProps) => {
    const theme = useTheme();
    const styles = stylesFn(theme)

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainerStyle}
                nestedScrollEnabled={true}
            >
                {props.attachmentLength === 0 ? (
                    <Card style={styles.card} onPress={() => props.handleAssetUpload()}>
                        <Card.Content style={styles.cardContent}>
                            <IconButton
                                icon={() => (
                                    <FontAwesomeIcon
                                        color={
                                            theme.dark ? Colors(theme).text : Colors(theme).primary
                                        }
                                        icon={faClapperboard}
                                        size={36}
                                    />
                                )}
                                size={40}
                                style={styles.uploadIcon}
                            />
                            <Paragraph style={styles.cardParagraph}>
                                Upload Photos/Videos or any Sample work that might match with this brand's campaign
                            </Paragraph>
                        </Card.Content>
                    </Card>
                ) : props.FileRenderComponent}
                <View>
                    <TextInput
                        style={{
                            backgroundColor: Colors(theme).background,
                        }}
                        activeOutlineColor={Colors(theme).primary}
                        label="Add a short note"
                        mode="outlined"
                        multiline
                        onChangeText={(text) => props.setNote(text)}
                        placeholderTextColor={Colors(theme).text}
                        textColor={Colors(theme).text}
                        value={props.note}
                    />
                    <HelperText type="info" style={styles.helperText}>
                        Write a short note to the brand about why you are interested in this
                    </HelperText>

                    <List.Section>
                        <ListItem
                            title="Your Quote"
                            small={true}
                            leftIcon={faDollarSign}
                            content={props.quotation === undefined ? "(Required)" : "Rs. " + props.quotation}
                            rightContent={true}
                            onAction={() => props.setQuotation()}
                        />
                        {/* <ListItem
              title="Timeline"
              small={true}
              leftIcon={faClockRotateLeft}
              content={<input
                // @ts-ignore
                ref={dateRef}
                type="date"
                onChange={(e) => setTimelineData(new Date(e.target.value))}
                value={
                  timelineData ? timelineData.toISOString().split("T")[0] : ""
                }
                placeholder="Select a date"
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: 16,
                  color: Colors(theme).textSecondary,
                  // color: "inherit",
                  outline: "none",
                  borderWidth: 0,
                }}
              />}
              rightContent={true}
              onAction={() => {
                try {
                  dateRef.current?.showPicker?.() || dateRef.current?.click()
                } catch (e: any) {
                  Console.error(e);
                }
              }}
            />

            <ListItem
              title="Attachments"
              small={true}
              leftIcon={faPaperclip}
              content=""
              attachments={fileAttachments}
              onAction={handlePickAttachment}
              onRemove={(id) => {
                setFileAttachments((prevAttachments: any) =>
                  prevAttachments.filter((f: any) => f.id !== id)
                );
              }}
            /> */}
                        {props.questions.length > 0 && (
                            <View style={{ marginTop: 32 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                                    Questions asked by the brand
                                </Text>
                                <Text style={{ fontSize: 13, color: Colors(theme).textSecondary, marginBottom: 16 }}>
                                    These questions are optional, but we recommend you answer them thoughtfully. Brands consider your responses while shortlisting influencers.
                                </Text>
                            </View>
                        )}
                        {props.questions.map((question, index) => (
                            <ListItem
                                key={index}
                                small={true}
                                title={question}
                                leftIcon={faCircleQuestion}
                                content={props.answers[index] || ""}
                                onAction={() => props.setAnswers(question, index)}
                            />
                        ))}
                    </List.Section>
                </View>
            </ScrollView>
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                {props.errorMessage ? (
                    <HelperText type="error" style={styles.errorText}>
                        {props.errorMessage}
                    </HelperText>
                ) : null}
                {props.loading && <ProgressLoader isProcessing={props.loading} progress={0} subject={AWSProgressUpdateSubject} />}
                <Button
                    mode="contained"
                    onPress={async () => {
                        if (!props.note || props.note.length === 0) {
                            Toaster.error("Please add a note");
                            return;
                        }
                        if (props.attachmentLength === 0) {
                            Toaster.error("Please upload photos/videos on your application");
                            return;
                        }
                        if (props.quotation === undefined) {
                            Toaster.error("Please fill out your quotation", "If its Barter, type quotation as 0")
                            return
                        }
                        // if (!timelineData) {
                        //     Toaster.error("Please fill out the timeline")
                        //     return
                        // }
                        await props.handleSubmit();
                    }}
                    loading={props.loading}
                >
                    {props.loading ? "Uploading Assets" : (props.submitText || "Preview Application")}
                </Button>
            </View>
        </>
    )
}

export default ApplyNowContent