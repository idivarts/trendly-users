import EditProfile from "@/components/basic-profile/edit-profile";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import { useAuthContext } from "@/contexts";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { HttpWrapper } from "@/shared-libs/utils/http-wrapper";
import { resetAndNavigate } from "@/shared-libs/utils/router";
import BottomSheetScrollContainer from "@/shared-uis/components/bottom-sheet/scroll-view";
import ConfirmationModal from "@/shared-uis/components/ConfirmationModal";
import ProfileBottomSheet from "@/shared-uis/components/ProfileModal/Profile-Modal";
import {
  BottomSheetBackdrop
} from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";

const EditProfileScreen: React.FC = () => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [clickBack, setClickBack] = useState(false)
  const [openBottomSheet, setOpenBottomSheet] = useState(false)

  const theme = useTheme();

  const navigation = useNavigation()
  const closeProfileModal = () => {
    setOpenBottomSheet(false)
  }

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isInstagram, setIsInstagram] = useState(false);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const response = await HttpWrapper.fetch(`/api/v1/socials/medias?userId=${AuthApp.currentUser?.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).finally(() => {
      setLoadingPosts(false)
    });
    const data = await response.json();

    if (data.data.isInstagram) {
      setIsInstagram(true);
      setPosts(data.data.medias);
      setLoadingPosts(false);
    } else {
      setIsInstagram(false);
      setPosts(data.data.posts);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const { user } = useAuthContext();

  const renderBackdrop = (props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Edit Profile"
        action={() => {
          if (unsavedChanges) {
            setClickBack(true)
            return;
          }
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            resetAndNavigate("/collaborations");
          }
        }}
        rightAction
        rightActionButton={
          <Pressable
            onPress={() => {
              if (unsavedChanges) {
                setConfirmationModalVisible(true);
                return;
              }
              setOpenBottomSheet(true)
            }}
            style={{ padding: 10 }}
          >
            <Text>Preview</Text>
          </Pressable>
        }
      />

      <EditProfile
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
      />

      <BottomSheetScrollContainer
        isVisible={openBottomSheet}
        snapPointsRange={["90%", "90%"]}
        onClose={() => { setOpenBottomSheet(false) }}
      >
        <ProfileBottomSheet
          influencer={user as IUsers}
          theme={theme}
          FireStoreDB={FirestoreDB}
          isBrandsApp={false}
          closeModal={closeProfileModal}
          loadingPosts={loadingPosts}
          posts={posts}
          isInstagram={isInstagram}
        />
      </BottomSheetScrollContainer>

      <ConfirmationModal
        cancelAction={() => {
          setClickBack(false);
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            resetAndNavigate("/collaborations");
          }
        }}
        confirmAction={() => {
          setClickBack(false);
        }}
        confirmText="Stay!"
        cancelText="Discard"
        title="Discard Changes?"
        description="Going back would discard your changes. Are you sure?"
        setVisible={setClickBack}
        visible={clickBack}
      />
      <ConfirmationModal
        cancelAction={() => setConfirmationModalVisible(false)}
        confirmAction={() => {
          setOpenBottomSheet(true)
          setConfirmationModalVisible(false);
        }}
        confirmText="Continue"
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to continue?"
        setVisible={setConfirmationModalVisible}
        visible={confirmationModalVisible}
      />
    </View>
  );
};

export default EditProfileScreen;
