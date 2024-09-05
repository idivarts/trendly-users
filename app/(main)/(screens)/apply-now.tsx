import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Title,
  RadioButton,
  Card,
  Checkbox,
  Paragraph,
  HelperText,
  IconButton,
} from "react-native-paper";
import { createStyles } from "@/styles/ApplyNow.styles";
import { useTheme } from "@react-navigation/native";

const ApplyScreen = () => {
  const theme = useTheme();
  const [collabType, setCollabType] = useState("Paid");
  const [note, setNote] = useState("");
  const [cv, setCv] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [products, setProducts] = useState<string[]>([
    "Product1",
    "Product2",
    "Product3",
  ]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [targetReach, setTargetReach] = useState<string>("");

  const handleProductSelect = (product: string) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(product)
        ? prevSelectedProducts.filter((p) => p !== product)
        : [...prevSelectedProducts, product]
    );
  };

  const handleCvUpload = () => {
    // Logic for uploading CV (use expo-document-picker or similar)
  };

  const handleSubmit = () => {
    if (!targetReach || selectedProducts.length === 0) {
      setErrorMessage("Please fill all the required fields");
      return;
    }
    // Logic to handle form submission
    console.log({
      collabType,
      selectedProducts,
      targetReach,
      note,
      cv,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Apply Now</Title>

      {/* Collaboration Type Selection */}
      <Paragraph style={styles.label}>Select Collaboration Type:</Paragraph>
      <RadioButton.Group
        onValueChange={(value) => setCollabType(value)}
        value={collabType}
      >
        <RadioButton.Item
          label="Paid"
          value="Paid"
          color={theme.colors.primary}
        />
        <RadioButton.Item
          label="Unpaid"
          value="Unpaid"
          color={theme.colors.primary}
        />
        <RadioButton.Item
          label="Product"
          value="Product"
          color={theme.colors.primary}
        />
      </RadioButton.Group>

      {/* Product Selection */}
      <Paragraph style={styles.label}>Select Product(s):</Paragraph>
      {products.map((product, index) => (
        <Checkbox.Item
          label={product}
          status={selectedProducts.includes(product) ? "checked" : "unchecked"}
          onPress={() => handleProductSelect(product)}
          key={index}
          color={theme.colors.primary}
        />
      ))}

      {/* Target Reach Input */}
      <TextInput
        label="Target Reach"
        value={targetReach}
        onChangeText={(text) => setTargetReach(text)}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary } }}
      />
      <HelperText type="info" style={styles.helperText}>
        Explain that it's not a hard limit, but it will impact job success rate.
        Exceeding the target may lead to bonuses.
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
          <Paragraph>Upload CV</Paragraph>
        </Card.Content>
      </Card>

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
