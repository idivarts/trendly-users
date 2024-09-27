import { useEffect, useState } from "react";
import { Text, View } from "../theme/Themed"
import { Switch } from "react-native-paper";
import { useAuthContext } from "@/contexts";
import stylesFn from "@/styles/settings/Settings.styles";
import { useTheme } from "@react-navigation/native";

const Settings = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const {
    user,
    updateUser
  } = useAuthContext();
  const theme = useTheme();
  const styles = stylesFn(theme);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    if (!user) {
      return;
    }

    updateUser(
      user?.id,
      {
        settings: {
          theme: isSwitchOn ? "light" : "dark"
        },
      },
    );
  };

  useEffect(() => {
    if (user?.settings?.theme) {
      setIsSwitchOn(user.settings.theme === "dark");
    }
  }, [user]);

  return (
    <View
      style={styles.settingsContainer}
    >
      <View
        style={styles.settingsRow}
      >
        <Text
          style={styles.settingsLabel}
        >
          Theme ({isSwitchOn ? "Dark" : "Light"})
        </Text>
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
        />
      </View>
    </View>
  );
};

export default Settings;
