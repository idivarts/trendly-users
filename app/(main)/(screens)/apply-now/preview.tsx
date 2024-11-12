import AppLayout from "@/layouts/app-layout";
import { View, Text, FlatList } from "react-native";
import InfluencerCard from "@/components/InfluencerCard";
import { router, useLocalSearchParams } from "expo-router";
import { Appbar, Button } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/ui/back-button/BackButton";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { collection, addDoc } from "firebase/firestore";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { useState, useEffect } from "react";

const Preview = () => {
  const params = useLocalSearchParams();
  const theme = useTheme();
  const user = AuthApp.currentUser;
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const note = Array.isArray(params.note) ? params.note[0] : params.note;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processedAttachments, setProcessedAttachments] = useState([]);

  useEffect(() => {
    try {
      if (params.attachments) {
        const rawAttachments = JSON.parse(params.attachments as string);
        // Process the attachments to match the format expected by InfluencerCard
        const processed = rawAttachments.map((attachment: any) => ({
          type: attachment.type,
          // For videos, include both URLs
          ...(attachment.type === "video" && {
            appleUrl: attachment.appleUrl,
            playUrl: attachment.playUrl,
          }),
          // For images, include the URL
          ...(attachment.type === "image" && {
            url: attachment.url,
          }),
        }));
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
      <Appbar.Header
        statusBarHeight={0}
        style={{
          backgroundColor: Colors(theme).background,
        }}
      >
        <BackButton />
        <Appbar.Content title="Preview" color={Colors(theme).text} />
      </Appbar.Header>
      <FlatList
        data={[1]}
        renderItem={() => {
          return (
            <InfluencerCard
              ToggleModal={() => {}}
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
          padding: 16,
        }}
      />
    </AppLayout>
  );
};

export default Preview;
