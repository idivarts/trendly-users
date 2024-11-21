import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { SURVEY_DATA } from "@/constants/SurveyData";
import {
  handleNextQuestion,
  handlePreviousQuestion,
  submitSurvey,
} from "@/components/surverHandlers";
import { stylesFn } from "@/styles/Questions.styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const theme = useTheme();
  const styles = stylesFn(theme);
  const router = useRouter();

  // const { user } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const user = Array.isArray(params.user) ? params.user[0] : params.user;

  const currentQuestion = SURVEY_DATA[currentQuestionIndex];

  const handleNext = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption || "";
    setAnswers(updatedAnswers);

    if (currentQuestionIndex === SURVEY_DATA.length - 1) {
      // Last question, submit survey and don't move to next
      submitSurvey(updatedAnswers)
        .then(() => {
          router.replace("/collaborations");
        })
        .catch((error) => {
          console.error("Error submitting survey:", error);
        });
    } else {
      // Move to the next question
      handleNextQuestion(
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setSelectedOption,
        selectedOption
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            handlePreviousQuestion(
              currentQuestionIndex,
              setCurrentQuestionIndex,
              setSelectedOption
            )
          }
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={Colors(theme).black}
          />
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
                selectedOption === option
                  ? Colors(theme).secondary
                  : Colors(theme).whiteSmoke,
            }}
            labelStyle={
              selectedOption === option ? styles.selectedOption : null
            }
          />
        ))}
      </RadioButton.Group>

      <View style={styles.bottomNavigation}>
        {currentQuestionIndex === SURVEY_DATA.length - 1 ? (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons
              name="arrow-forward-circle"
              size={60}
              color={Colors(theme).amber}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons
              name="arrow-forward-circle"
              size={60}
              color={Colors(theme).amber}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.replace("/collaborations")}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Questions;
