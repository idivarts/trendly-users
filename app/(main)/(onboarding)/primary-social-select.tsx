import { Text, View } from "@/components/theme/Themed";
import { useAuthContext, useSocialContext } from "@/contexts";
import AppLayout from "@/layouts/app-layout";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/Questions.styles";
import { resetAndNavigate } from "@/utils/router";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
;
;
;

const PrimarySocialSelect = () => {
  const { user } = useAuthContext();
  const { socials } = useSocialContext();
  const theme = useTheme();
  const styles = stylesFn(theme);

  const [selectedSocialId, setSelectedSocialId] = useState(
    user?.primarySocial || null
  );

  const updatePrimarySocial = async (socialId: string) => {
    try {
      const userId = user?.id;
      if (!userId) return;

      const userDocRef = doc(FirestoreDB, "users", userId);
      await updateDoc(userDocRef, { primarySocial: socialId })
        .then(() => {
          HttpWrapper.fetch("/api/v1/chat/auth", { method: "POST", });
          Toaster.success("Social marked as primary");
          resetAndNavigate("/questions");
        })
        .catch((error) => {
          Toaster.error("Error marking social as primary");
        });
    } catch (error) {
      Console.error(error);
    }
  };

  useEffect(() => {
    if (socials.length == 1) {
      setSelectedSocialId(socials[0].id);
      updatePrimarySocial(socials[0].id);
    }
  }, [socials])

  return (
    <AppLayout withWebPadding={true}>
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
                setSelectedSocialId(item.id); // Update the selected social media
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
    </AppLayout>
  );
};

export default PrimarySocialSelect;
