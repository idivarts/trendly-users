import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthContext } from "@/contexts";
import { createstyles } from "@/styles/Questions.styles";
import { useTheme } from "@react-navigation/native";

const surveyData = [
  {
    id: 1,
    question: "What is your life stage?",
    options: ["Single", "Parent", "Other"],
  },
  {
    id: 2,
    question: "What is your employment status?",
    options: [
      "Full-time employee",
      "Self-employed",
      "Business owner",
      "Retired",
      "Other",
    ],
  },
  {
    id: 3,
    question: "Do you own any of these?",
    options: ["House", "Car", "Boat", "Other"],
  },
];

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Explicitly type the state
  const { signIn } = useAuthContext();
  const { colors } = useTheme();
  const styles = createstyles(colors);

  const currentQuestion = surveyData[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < surveyData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      signIn();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <RadioButton.Group
        onValueChange={(value) => setSelectedOption(value)}
        value={selectedOption || ""}
      >
        {currentQuestion.options.map((option, index) => (
          <RadioButton.Item
            key={index}
            label={option}
            value={option}
            style={{
              ...styles.optionItem,
              backgroundColor:
                selectedOption === option ? "#1b1b1b" : "#f5f5f5",
            }}
            labelStyle={
              selectedOption === option ? styles.selectedOption : null
            }
          />
        ))}
      </RadioButton.Group>

      <View style={styles.bottomNavigation}>
        {currentQuestionIndex === surveyData.length - 1 ? (
          <TouchableOpacity onPress={signIn} style={styles.nextButton}>
            <Ionicons name="arrow-forward-circle" size={60} color="#FFBF00" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons name="arrow-forward-circle" size={60} color="#FFBF00" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => console.log("Skip pressed")}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Questions;
