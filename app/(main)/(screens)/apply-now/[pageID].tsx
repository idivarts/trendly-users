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
import { signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
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
  const theme = useTheme();
  const styles = stylesFn(theme);

  const resetForm = () => {
    setNote("");
    setFiles([]);
    setErrorMessage("");
  };

  const handleCvUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync({});
    if (!file.canceled) {
      setFiles((prevFiles) => [...prevFiles, file.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting application");

      if (!note) {
        setErrorMessage("Note is required");
        return;
      }

      if (!files.length) {
        setErrorMessage("CV is required");
        return;
      }

      if (!pageID) {
        setErrorMessage("Invalid page ID");
        return;
      }

      const user = await signInWithEmailAndPassword(
        AuthApp,
        "testuser@gmail.com",
        "password"
      );
      console.log("User signed in anonymously");

      const urls = await Promise.all(
        files.map(async (fileUri) => {
          const fileName = fileUri.split("/").pop();

          const response = await fetch(fileUri);
          const blob = await response.blob();

          console.log("Uploading file", blob);

          const fileRef = ref(
            StorageApp,
            `collaboration/${pageID}/applications/${user.user.uid}/${fileName}`
          );

          await uploadBytes(fileRef, blob);

          return getDownloadURL(fileRef);
        })
      );

      console.log("Files uploaded successfully");

      const applicantData: IApplications = {
        userId: user.user.uid,
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
        console.log("Application submitted successfully");
        resetForm();
      } else {
        setErrorMessage("Failed to submit application");
        console.log("Failed to submit application");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Error submitting application");
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
          Submit Application
        </Button>
      </ScrollView>
    </AppLayout>
  );
};

export default ApplyScreen;
