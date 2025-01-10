import AppLayout from "@/layouts/app-layout";
import { View, Text, FlatList, Platform } from "react-native";
import InfluencerCard from "@/components/InfluencerCard";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import { FirestoreDB } from "@/utils/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { useState, useEffect } from "react";
import ScreenHeader from "@/components/ui/screen-header";
import { processRawAttachment } from "@/utils/attachments";
import { useAuthContext } from "@/contexts";
import { useBreakpoints } from "@/hooks";

const Preview = () => {
  const params = useLocalSearchParams();
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
      await setDoc(applicantDocRef, applicantData).then(() => {
        setErrorMessage("Application submitted successfully");
        setTimeout(() => {
          router.navigate("/collaborations");
        }, 1000); // Give user time to see success message
      }).catch((e) => {
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
    <AppLayout>
      <ScreenHeader title="Preview" />
      <FlatList
        data={[1]}
        renderItem={() => {
          return (
            <InfluencerCard
              ToggleModal={() => { }}
              type="influencer"
              influencer={{
                //@ts-ignore
                bio: "",
                followers: 100,
                name: user?.name || "John Doe",
                profilePic:
                  user?.profileImage || "https://randomuser.me/api/portraits",
                handle: user?.email?.split("@")[0] || "john_doe",
                jobsCompleted: 10,
                rating: 5,
                media: processedAttachments, // Using processed attachments
                reach: 1000,
                successRate: 100,
              }}
            />
          );
        }}
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Text
              style={{
                color: errorMessage.includes("successfully") ? "green" : "red",
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
        }
        style={{
          width: xl ? 768 : "100%",
          marginHorizontal: "auto",
        }}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: Platform.OS === "web" ? 16 : 0,
        }}
      />
    </AppLayout>
  );
};

export default Preview;
