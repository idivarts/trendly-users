import AppLayout from "@/layouts/app-layout";
import { View, Text, FlatList } from "react-native";
import InfluencerCard from "@/components/InfluencerCard";
import { router, useLocalSearchParams } from "expo-router";
import { Appbar, Button } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import BackButton from "@/components/ui/back-button/BackButton";
import { AuthApp } from "@/utils/auth";
import { StorageApp } from "@/utils/firebase-storage";
import { FirestoreDB } from "@/utils/firestore";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { useState } from "react";

const Preview = () => {
  const params = useLocalSearchParams();
  //@ts-ignore
  const parsedAttachments = JSON.parse(params.attachments);
  const theme = useTheme();
  const user = AuthApp.currentUser;
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const note = Array.isArray(params.note) ? params.note[0] : params.note;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (!note) {
        setErrorMessage("Note is required");
        return;
      }

      if (!parsedAttachments.length) {
        setErrorMessage("File is required");
        return;
      }

      if (!pageID) {
        setErrorMessage("Invalid page ID");
        return;
      }

      //fetch current logged in user

      const user = AuthApp.currentUser;

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
        attachments: parsedAttachments,
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
      } else {
        setErrorMessage("Failed to submit application");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Error submitting application");
    } finally {
      setLoading(false);
      router.push("/collaborations");
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
                bio: "I am a cool",
                followers: 100,
                name: user?.displayName || "John Doe",
                profilePic: "https://randomuser.me/api/portraits",
                handle: "john_doe",
                jobsCompleted: 10,
                rating: 5,
                media: parsedAttachments,
                reach: 1000,
                successRate: 100,
              }}
            />
          );
        }}
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: "red" }}>{errorMessage}</Text>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
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
