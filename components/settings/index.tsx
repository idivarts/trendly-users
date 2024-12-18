import { useEffect, useState } from "react";
import { View } from "../theme/Themed";
import stylesFn from "@/styles/settings/Settings.styles";
import { useTheme } from "@react-navigation/native";
import ContentWrapper from "../ui/content-wrapper";
import { Selector } from "../ui/select/selector";
import { faDollarSign, faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
import SelectGroup from "../ui/select/select-group";
import { ScrollView } from "react-native";
import Button from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "@/constants/Colors";
import { User } from "@/types/User";
import { AccountStatus } from "@/shared-libs/firestore/trendly-pro/models/users";
import ConfirmationModal from "../ui/modal/ConfirmationModal";
import Toaster from "@/shared-uis/components/toaster/Toaster";

interface SettingsProps {
  handleDeactivate: () => Promise<void>;
  handleDelete: () => Promise<void>;
  isDeactivating: boolean;
  isDeleting: boolean;
  onSave: (user: User) => void;
  user: User;
}

const Settings: React.FC<SettingsProps> = ({
  handleDeactivate,
  handleDelete,
  isDeactivating,
  isDeleting,
  onSave,
  user,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [settings, setSettings] = useState({
    accountStatus: user?.settings?.accountStatus || AccountStatus.Activated,
    theme: user?.settings?.theme || 'light',
    availability: user?.settings?.availability || 'Open to Collaborate',
    profileVisibility: user?.settings?.profileVisibility || 'Public',
    dataSharing: user?.settings?.dataSharing || 'Share Insights',
  });
  const [deactivationModalVisible, setDeactivationModalVisible] = useState(false);
  const [deletionModalVisible, setDeletionModalVisible] = useState(false);

  const handleOnSave = () => {
    const updatedUser = {
      ...user,
      settings: {
        ...user.settings,
        ...settings,
      }
    };

    onSave(updatedUser);
  }

  useEffect(() => {
    handleOnSave();
  }, [settings]);

  return (
    <ScrollView
      style={styles.settingsContainer}
      contentContainerStyle={{
        paddingBottom: 80,
        gap: 46,
      }}
    >
      <ContentWrapper
        title="Availability"
        description="Set your availability. Note, if you are marked as not available then brands wont be able to invite you to collaborations."
      >
        <Selector
          options={[
            {
              icon: faVideo,
              label: 'Open to Collaborate',
              value: 'Open to Collaborate',
            },
            {
              icon: faDollarSign,
              label: 'Not Available',
              value: 'Not Available',
            },
          ]}
          onSelect={(value) => {
            setSettings({
              ...settings,
              availability: value,
            });
          }}
          selectedValue={settings.availability}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Profile Visibility"
        description="Decide if your profile would be visible on the explore page. If private, User can only see your profile if you apply."
      >
        <SelectGroup
          items={[
            { label: 'Public', value: 'Public' },
            { label: 'Private', value: 'Private' },
          ]}
          selectedItem={{
            label: settings.profileVisibility,
            value: settings.profileVisibility,
          }}
          onValueChange={(item) => {
            setSettings({
              ...settings,
              profileVisibility: item.value,
            });
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="App Theme"
        description="Decide the theme of the platform."
      >
        <SelectGroup
          items={[
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ]}
          selectedItem={{
            label: settings.theme,
            value: settings.theme,
          }}
          onValueChange={(item) => {
            setSettings({
              ...settings,
              theme: item.value as 'light' | 'dark',
            });
          }}
        />
      </ContentWrapper>
      <ContentWrapper
        title="Data Sharing"
        description="Decide if your social insights is to be shared to the brands."
      >
        <SelectGroup
          items={[
            { label: 'Share Insights', value: 'Share Insights' },
            { label: 'Hide Insights', value: 'Hide Insights' },
          ]}
          selectedItem={{
            label: settings.dataSharing,
            value: settings.dataSharing,
          }}
          onValueChange={(item) => {
            setSettings({
              ...settings,
              dataSharing: item.value,
            });
          }}
        />
      </ContentWrapper>
      <View
        style={{
          gap: 16,
        }}
      >
        <Button
          mode="outlined"
          onPress={() => {
            setDeactivationModalVisible(true);
          }}
          customStyles={{
            borderColor: Colors(theme).danger,
          }}
          loading={isDeactivating}
          labelStyle={{
            color: Colors(theme).danger,
          }}
        >
          Deactivate Account
        </Button>
        <Button
          onPress={() => {
            setDeletionModalVisible(true);
          }}
          loading={isDeleting}
          customStyles={{
            backgroundColor: Colors(theme).danger,
          }}
        >
          {
            !isDeleting && (
              <FontAwesomeIcon
                icon={faTrash}
                style={{
                  marginRight: 8,
                }}
                color={Colors(theme).white}
              />
            )
          }
          {isDeleting ? "Deleting" : "Delete"} Account
        </Button>
      </View>
      <ConfirmationModal
        cancelAction={() => {
          setDeactivationModalVisible(false);
        }}
        confirmAction={() => {
          handleDeactivate().then(() => {
            setDeactivationModalVisible(false);
            Toaster.success('Account deactivated successfully');
          });
        }}
        confirmText="Deactivate"
        description="Are you sure you want to deactivate your account?"
        setVisible={setDeactivationModalVisible}
        visible={deactivationModalVisible}
      />
      <ConfirmationModal
        cancelAction={() => {
          setDeletionModalVisible(false);
        }}
        confirmAction={() => {
          setDeletionModalVisible(false);
          handleDelete().then(() => {
            Toaster.success('Account deleted successfully');
          });
        }}
        confirmText="Delete"
        description="Are you sure you want to delete your account? This action is irreversible."
        setVisible={setDeletionModalVisible}
        visible={deletionModalVisible}
      />
    </ScrollView>
  );
};

export default Settings;
