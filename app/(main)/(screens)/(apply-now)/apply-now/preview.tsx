import AppLayout from "@/layouts/app-layout";
import { View, Text, FlatList, Platform } from "react-native";
import InfluencerCard from "@/components/InfluencerCard";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { collection, addDoc } from "firebase/firestore";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { useState, useEffect } from "react";
import ScreenHeader from "@/components/ui/screen-header";
import { MediaItem } from "@/components/ui/carousel/render-media-item";

const Preview = () => {
  const params = useLocalSearchParams();
  const user = AuthApp.currentUser;
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const note = Array.isArray(params.note) ? params.note[0] : params.note;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processedAttachments, setProcessedAttachments] = useState([]);

  const formatProcessedAttachment = (attachment: any): MediaItem => {
    if (attachment.type.includes("video")) {
      if (Platform.OS === "ios") {
        return {
          id: attachment.appleUrl,
          type: attachment.type,
          url: attachment.appleUrl,
        }
      } else {
        return {
          id: attachment.playUrl,
          type: attachment.type,
          url: attachment.playUrl,
        }
      }
    } else {
      return {
        id: attachment.imageUrl,
        type: attachment.type,
        url: attachment.imageUrl,
      }
    }
  }

  useEffect(() => {
    try {
      if (params.attachments) {
        const rawAttachments = JSON.parse(params.attachments as string);

        const processed = rawAttachments.map((attachment: any) => formatProcessedAttachment(attachment));

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

      if (!processedAttachments.length) {
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
        userId: user?.uid,
        collaborationId: pageID,
        status: "pending",
        timeStamp: Date.now(),
        message: note,
        attachments: processedAttachments, // Using the processed attachments
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
          router.push("/collaborations");
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
                name: user?.displayName || "John Doe",
                profilePic:
                  user?.photoURL || "https://randomuser.me/api/portraits",
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
