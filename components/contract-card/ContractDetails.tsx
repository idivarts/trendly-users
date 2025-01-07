import { Text, View } from "@/components/theme/Themed";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";

interface ContractDetailsProps {
  application: IApplications;
  collabDetails: string;
}

const ContractDetails: FC<ContractDetailsProps> = ({
  application,
  collabDetails,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        gap: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: Colors(theme).text,
          }}
        >
          {collabDetails}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: Colors(theme).text,
          }}
        >
          Quote: Rs {application.quotation}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Colors(theme).text,
          }}
        >
          {/* timeline */}
          Timeline: {new Date(application.timeline).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default ContractDetails;
