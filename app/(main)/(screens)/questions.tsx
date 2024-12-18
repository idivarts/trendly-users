import React, { useEffect, useState } from "react";
import { Pressable, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SURVEY_DATA } from "@/constants/SurveyData";
import { submitSurvey } from "@/components/surverHandlers";
import { stylesFn } from "@/styles/Questions.styles";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { SurveyAnswer } from "@/types/Survey";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRight,
  faCheck,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/components/ui/select";
import { Text, View } from "@/components/theme/Themed";
import { useSocialContext } from "@/contexts/social-context.provider";
import { useAuthContext } from "@/contexts";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import Toaster from "@/shared-uis/components/toaster/Toaster";

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer>({
    question1: [],
    question2: [],
    question3: [],
    question4: [],
  });
  const { user } = useAuthContext();
  const { socials } = useSocialContext();
  const theme = useTheme();
  const styles = stylesFn(theme);
  const router = useRouter();

  const currentQuestion = SURVEY_DATA[currentQuestionIndex];
  const [selectedSocialId, setSelectedSocialId] = useState(
    user?.primarySocial || null
  );

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
          router.replace("/collaborations");
        })
        .catch((error) => {
          console.error("Error submitting survey:", error);
        });
    } else {
      if (currentQuestionIndex < SURVEY_DATA.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
      }
    }
  };

  const updatePrimarySocial = async (socialId: string) => {
    try {
      const userId = user?.id;
      if (!userId) return;

      const userDocRef = doc(FirestoreDB, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data() as IUsers;

      userData.primarySocial = socialId;

      await updateDoc(userDocRef, { primarySocial: userData.primarySocial })
        .then(() => {
          Toaster.success("Social marked as primary");
        })
        .catch((error) => {
          Toaster.error("Error marking social as primary");
        });
    } catch (error) {
      console.error("Error updating primary social:", error);
    }
  };

  if (!user?.primarySocial) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.questionText}>
            Select your primary social media
          </Text>
        </View>

        <View
          style={[
            {
              flex: 1,
              gap: 8,
              flexDirection: "column",
              justifyContent: "center",
            },
          ]}
        >
          {socials.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedSocialId(item.id);
              }}
            >
              <View
                style={[
                  {
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    gap: 12,
                    backgroundColor:
                      selectedSocialId === item.id
                        ? Colors(theme).primary
                        : Colors(theme).lightgray,
                  },
                ]}
              >
                {/* Social Media Icon */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor:
                      selectedSocialId === item.id
                        ? Colors(theme).primary
                        : Colors(theme).lightgray,
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: Colors(theme).lightgray,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={item.isInstagram ? faInstagram : faFacebook}
                      color={Colors(theme).text}
                      size={20}
                    />
                  </View>
                  <Text
                    style={{
                      color:
                        selectedSocialId === item.id
                          ? Colors(theme).white
                          : Colors(theme).text,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>

                {/* Checkmark if selected */}
                {selectedSocialId === item.id && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={Colors(theme).text}
                    size={20}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomNavigation}>
          <Pressable
            onPress={() => {
              if (selectedSocialId) {
                updatePrimarySocial(selectedSocialId);
              }
            }}
            style={styles.nextButton}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              size={30}
              color={Colors(theme).white}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
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
          onPress={() => router.replace("/collaborations")}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Questions;
