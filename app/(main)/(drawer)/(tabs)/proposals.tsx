import { Text, View } from "@/components/theme/Themed";
import AppLayout from "@/layouts/app-layout";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { stylesFn } from "@/styles/Proposal.styles";
import Applications from "@/components/proposals/Applications";
import Invitations from "@/components/proposals/Invitations";

const ProposalScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"proposals" | "forYou">(
    "proposals"
  );

  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <AppLayout>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => setSelectedTab("proposals")}>
            <Text
              style={
                selectedTab === "proposals" ? styles.titleActive : styles.title
              }
            >
              Applications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab("forYou")}>
            <Text
              style={
                selectedTab === "forYou" ? styles.titleActive : styles.title
              }
            >
              Invitations
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === "proposals" && <Applications />}

        {selectedTab === "forYou" && <Invitations />}
      </View>
    </AppLayout>
  );
};

export default ProposalScreen;
