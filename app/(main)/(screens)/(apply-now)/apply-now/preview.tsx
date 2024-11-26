import AppLayout from "@/layouts/app-layout";
import { View, Text, FlatList } from "react-native";
import InfluencerCard from "@/components/InfluencerCard";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { collection, addDoc } from "firebase/firestore";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { useState, useEffect } from "react";
import ScreenHeader from "@/components/ui/screen-header";
import { processRawAttachment } from "@/utils/attachments";
import { useAuthContext } from "@/contexts";

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

  const {
    user
  } = useAuthContext();

  useEffect(() => {
    try {
      if (params.attachments) {
        const rawAttachments = JSON.parse(params.attachments as string);
        setRawAttachments(rawAttachments);

        const processed = rawAttachments.map((attachment: any) => processRawAttachment(attachment));

        setProcessedAttachments(processed);
      }
    } catch (error) {
      console.error("Error processing attachments:", error);
      setErrorMessage("Error processing attachments");
    }
  }, [params.attachments]);

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

      const applicantData: IApplications = {
        userId: user?.id,
        collaborationId: pageID,
        status: "pending",
        timeStamp: Date.now(),
        message: note,
        attachments: rawAttachments,
      };

      const applicantDocRef = collection(
        FirestoreDB,
        "collaborations",
        pageID,
        "applications"
      );

      const docset = await addDoc(applicantDocRef, applicantData);

      if (docset) {
        setErrorMessage("Application submitted successfully");
        setTimeout(() => {
          router.replace("/collaborations");
        }, 1000); // Give user time to see success message
      } else {
        setErrorMessage("Failed to submit application");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <ScreenHeader
        title="Preview"
      />
      <FlatList
        data={[1]}
        renderItem={() => {
          return (
            <InfluencerCard
              ToggleModal={() => { }}
              type="influencer"
              influencer={{
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
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      />
    </AppLayout>
  );
};

export default Preview;
