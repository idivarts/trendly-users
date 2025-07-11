import { submitSurvey } from "@/components/surverHandlers";
import { Text, View } from "@/components/theme/Themed";
import Select from "@/components/ui/select";
import { SURVEY_DATA } from "@/constants/SurveyData";
import { useAuthContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Questions.styles";
import { SurveyAnswer } from "@/types/Survey";
import {
  faArrowRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable } from "react-native";

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer>({
    question1: [],
    question2: [],
    question3: [],
    // question4: [],
  });
  const theme = useTheme();
  const styles = stylesFn(theme);
  const { resetAndNavigate } = useMyNavigation()

  const currentQuestion = SURVEY_DATA[currentQuestionIndex];

  const [selectedOptions, setSelectedOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const handleSelection = (
    selectedOptions: {
      label: string;
      value: string;
    }[]
  ) => {
    setSelectedOptions(selectedOptions);
  };

  const handleNext = () => {
    const updatedAnswers = {
      ...answers,
      [`question${currentQuestionIndex + 1}`]: selectedOptions.map(
        (option) => option.value
      ),
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex === SURVEY_DATA.length - 1) {
      submitSurvey(updatedAnswers)
        .then(() => {
          if (collaborationId)
            resetAndNavigate(`/collaboration-details/${collaborationId}`);
          else
            resetAndNavigate("/profile");
        })
        .catch((error) => {
          Console.error(error);
        });
    } else {
      if (currentQuestionIndex < SURVEY_DATA.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
      }
    }
  };

  const { collaborationId } = useAuthContext()

  return (
    <AppLayout withWebPadding={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedOptions([]);
              }
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={24}
              color={Colors(theme).text}
            />
          </Pressable>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <Select
          style={{
            gap: 12,
          }}
          direction="column"
          items={currentQuestion.options.map((option) => ({
            label: option,
            value: option,
          }))}
          onSelect={handleSelection}
          multiselect={currentQuestion.multiselect}
          value={selectedOptions}
          selectItemIcon
          selectItemStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        />

        <View style={styles.bottomNavigation}>
          {currentQuestionIndex === SURVEY_DATA.length - 1 ? (
            <Pressable onPress={handleNext} style={styles.nextButton}>
              <FontAwesomeIcon
                icon={faArrowRight}
                size={30}
                color={Colors(theme).white}
              />
            </Pressable>
          ) : (
            <Pressable onPress={handleNext} style={styles.nextButton}>
              <FontAwesomeIcon
                icon={faArrowRight}
                size={30}
                color={Colors(theme).white}
              />
            </Pressable>
          )}

          <Pressable
            onPress={() => resetAndNavigate("/profile")}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </AppLayout>
  );
};

export default Questions;
