import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthContext } from "@/contexts";
import { createStyles } from "@/styles/Questions.styles";
import { useTheme } from "@react-navigation/native";
import { SURVEY_DATA } from "@/constants/SurveyData";

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Explicitly type the state
  const { signIn } = useAuthContext();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const currentQuestion = SURVEY_DATA[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < SURVEY_DATA.length - 1) {
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

  const handleSkip = () => {
    console.log("Skip pressed");
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
        {currentQuestionIndex === SURVEY_DATA.length - 1 ? (
          <TouchableOpacity onPress={signIn} style={styles.nextButton}>
            <Ionicons name="arrow-forward-circle" size={60} color="#FFBF00" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons name="arrow-forward-circle" size={60} color="#FFBF00" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Questions;
