import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Card,
  Paragraph,
  HelperText,
  IconButton,
  Chip,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { FirestoreDB } from "@/shared-libs/utilities/firestore";
import { addDoc, collection } from "firebase/firestore";
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { AuthApp } from "@/shared-libs/utilities/auth";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { StorageApp } from "@/shared-libs/utilities/storage";
import { createStyles } from "@/styles/ApplyNow.styles";

const ApplyScreen = () => {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const pageID = Array.isArray(params.pageID)
    ? params.pageID[0]
    : params.pageID;
  const [note, setNote] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Apply Now</Title>

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
        theme={{ colors: { primary: theme.colors.primary } }}
      />

      {/* CV Upload */}
      <Card style={styles.card} onPress={handleCvUpload}>
        <Card.Content style={styles.cardContent}>
          <IconButton icon="file-upload" size={40} style={styles.uploadIcon} />
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
  );
};

export default ApplyScreen;
