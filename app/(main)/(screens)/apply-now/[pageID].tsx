import BackButton from "@/components/ui/back-button/BackButton";
import Colors from "@/constants/Colors";
import AppLayout from "@/layouts/app-layout";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import { stylesFn } from "@/styles/ApplyNow.styles";
import { AuthApp } from "@/utils/auth";
import { StorageApp } from "@/utils/firebase-storage";
import { FirestoreDB } from "@/utils/firestore";
import { useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  HelperText,
  IconButton,
  Paragraph,
  TextInput,
} from "react-native-paper";

const ApplyScreen = () => {
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const styles = stylesFn(theme);

  const resetForm = () => {
    setNote("");
    setFiles([]);
    setErrorMessage("");
  };

  const handleCvUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setFiles([...files, result.assets[0].uri]);
      } else {
        throw new Error("Invalid file selected");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Error uploading file");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (!note) {
        setErrorMessage("Note is required");
        return;
      }

      if (!files.length) {
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

      const urls = await Promise.all(
        files.map(async (fileUri) => {
          const fileName = fileUri.split("/").pop();

          const response = await fetch(fileUri);
          const blob = await response.blob();

          const fileRef = ref(
            StorageApp,
            `collaboration/${pageID}/applications/${user?.uid}/${fileName}`
          );

          await uploadBytes(fileRef, blob);

          return getDownloadURL(fileRef);
        })
      );

      const applicantData: IApplications = {
        userId: user?.uid,
        collaborationId: pageID,
        status: "pending",
        timeStamp: Date.now(),
        message: note,
        attachments: urls,
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
        resetForm();
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
        <Appbar.Content title="Apply Now" color={Colors(theme).text} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <HelperText type="info" style={styles.helperText}>
          Write a short note to the brand about why you are interested in this
        </HelperText>

        {/* Note Input */}
        <TextInput
          label="Write a Short Note"
          value={note}
          onChangeText={(text) => setNote(text)}
          mode="outlined"
          style={styles.input}
          multiline
          theme={{ colors: { primary: Colors(theme).primary } }}
        />

        {/* CV Upload */}
        <Card style={styles.card} onPress={handleCvUpload}>
          <Card.Content style={styles.cardContent}>
            <IconButton
              icon="file-upload"
              size={40}
              style={styles.uploadIcon}
            />
            <Paragraph>Upload Files</Paragraph>
          </Card.Content>
        </Card>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <View style={styles.uploadedFilesContainer}>
            <Paragraph style={styles.uploadedFilesTitle}>
              Uploaded Files:
            </Paragraph>
            {files.map((file, index) => (
              <Chip
                key={index}
                icon="file"
                style={styles.fileChip}
                onPress={() => {
                  // Optionally, handle file click or remove
                }}
              >
                {file.split("/").pop()}
              </Chip>
            ))}
          </View>
        )}

        {/* Error Message */}
        {errorMessage ? (
          <HelperText type="error" style={styles.errorText}>
            {errorMessage}
          </HelperText>
        ) : null}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors(theme).background} />
          ) : (
            "Submit Application"
          )}
        </Button>
      </ScrollView>
    </AppLayout>
  );
};

export default ApplyScreen;
