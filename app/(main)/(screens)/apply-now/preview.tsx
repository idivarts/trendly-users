import { CardActions } from "@/components/collaboration/card-components/secondary/card-actions";
import { CardDescription } from "@/components/collaboration/card-components/secondary/card-description";
import { CardFooter } from "@/components/collaboration/card-components/secondary/card-footer";
import { CardHeader } from "@/components/collaboration/card-components/secondary/card-header";
import Button from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
import Colors from "@/constants/Colors";
import { MAX_WIDTH_WEB } from "@/constants/Container";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";
import AppLayout from "@/layouts/app-layout";
import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { processRawAttachment } from "@/utils/attachments";
import { convertToKUnits } from "@/utils/conversion";
import { FirestoreDB } from "@/utils/firestore";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { Card } from "react-native-paper";

const Preview = () => {
  const params = useLocalSearchParams();
  const theme = useTheme();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const note = Array.isArray(params.note) ? params.note[0] : params.note;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processedAttachments, setProcessedAttachments] = useState([]);
  const [rawAttachments, setRawAttachments] = useState([]);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [answers, setAnswers] = useState<
    {
      question: number;
      answer: string;
    }[]
  >([]);
  const [timeline, setTimeline] = useState<number>(0);
  const [quotation, setQuotation] = useState<string>("");

  const { xl } = useBreakpoints();

  const { user } = useAuthContext();

  useEffect(() => {
    try {
      if (params.attachments) {
        const rawAttachments = JSON.parse(params.attachments as string);
        setRawAttachments(rawAttachments);

        const processed = rawAttachments.map((attachment: any) =>
          processRawAttachment(attachment)
        );

        setProcessedAttachments(processed);
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
      setErrorMessage("Error processing attachments");
    }
  }, [params.attachments]);

  useEffect(() => {
    try {
      if (params.fileAttachments) {
        const rawAttachments = JSON.parse(params.fileAttachments as string);
        setFileAttachments(rawAttachments);
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
      setErrorMessage("Error processing attachments");
    }
  }, [params.fileAttachments]);

  useEffect(() => {
    try {
      const quotationFromParams = JSON.parse(params.quotation as string);
      setQuotation(quotationFromParams);
      const timelineFromParams = JSON.parse(params.timeline as string);
      setTimeline(Number(timelineFromParams));
    } catch (error) {
      console.error("Error processing attachments:", error);
      setErrorMessage("Error processing attachments");
    }
  }, [params.fileAttachments]);

  useEffect(() => {
    try {
      if (params.answers) {
        const answers = JSON.parse(params.answers as string);
        var answersArray = [];
        for (var key in answers) {
          answersArray.push({ question: Number(key), answer: answers[key] });
        }
        setAnswers(answersArray);
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
      setErrorMessage("Error processing attachments");
    }
  }, [params.answers]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (!note) {
        setErrorMessage("Note is required");
        return;
      }

      if (!rawAttachments.length) {
        setErrorMessage("File is required");
        return;
      }

      if (!pageID) {
        setErrorMessage("Invalid page ID");
        return;
      }

      if (!user) {
        setErrorMessage("User not found");
        console.error("User not found");
        return;
      }

      //@ts-ignore
      const applicantData: IApplications = {
        userId: user?.id,
        collaborationId: pageID,
        status: "pending",
        timeStamp: Date.now(),
        message: note,
        attachments: rawAttachments,
        fileAttachments: fileAttachments,
        answersFromInfluencer: answers,
        quotation: quotation,
        timeline,
      };

      const applicantColRef = collection(
        FirestoreDB,
        "collaborations",
        pageID,
        "applications"
      );

      // Application Id as userId
      const applicantDocRef = doc(applicantColRef, user?.id);
      await setDoc(applicantDocRef, applicantData)
        .then(() => {
          setErrorMessage("Application submitted successfully");
          setTimeout(() => {
            router.navigate("/collaborations");
          }, 1000); // Give user time to see success message
        })
        .catch((e) => {
          setErrorMessage("Failed to submit application");
        });
    } catch (e) {
      console.error(e);
      setErrorMessage("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout withWebPadding={true}>
      <ScreenHeader title="Preview" />
      <ScrollView>
        <Card
          style={[{
            paddingVertical: 16,
          }, Platform.OS === "web" ? { alignSelf: "center", maxWidth: MAX_WIDTH_WEB, marginVertical: 8 } : {}]}
        >
          <CardHeader
            avatar={user?.profileImage || ""}
            handle={user?.socials?.[0]}
            isVerified={user?.isVerified}
            name={user?.name || ""}
          />
          <Carousel
            data={rawAttachments.map((attachment: Attachment) =>
              processRawAttachment(attachment)
            )}
            theme={theme}
          />
          <CardActions
            metrics={{
              followers: user?.backend?.followers || 0,
              reach: user?.backend?.reach || 0,
              rating: user?.backend?.rating || 0,
            }}
          />
          <CardDescription text={note} />
          <CardFooter
            quote={convertToKUnits(Number(quotation)) as string}
            timeline={new Date(timeline).toLocaleDateString("en-US")}
          />
        </Card>

      </ScrollView>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text
          style={{
            color: errorMessage.includes("successfully")
              ? Colors(theme).green
              : Colors(theme).red,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {errorMessage}
        </Text>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          Submit Application
        </Button>
      </View>
      {/* <FlatList
        data={[1]}
        renderItem={() => {
          return (
            
          );
        }}
        ListFooterComponent={
          
        }
        style={{
          width: xl ? 768 : "100%",
          marginHorizontal: "auto",
        }}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: Platform.OS === "web" ? 16 : 0,
        }}
      /> */}
    </AppLayout>
  );
};

export default Preview;
