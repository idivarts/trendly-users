import Colors from "@/constants/Colors";
import { useAuthContext, useChatContext } from "@/contexts";
import { CrashLog } from "@/shared-libs/utils/firebase/crashlytics";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { FC, useEffect } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Text, View } from "../theme/Themed";
import MembersCard from "./members-card";
;

interface MemberContainerProps {
  channelId: string;
  setMembersFromBrand: (members: any[]) => void;
}

const MemberContainer: FC<MemberContainerProps> = ({
  channelId,
  setMembersFromBrand,
}) => {
  const theme = useTheme();
  const { fetchMembers } = useChatContext();
  const { user } = useAuthContext();
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchMembersFromClient = async () => {
    try {
      setLoading(true);
      const members = await fetchMembers(channelId);

      const memberData = await Promise.all(
        members.map(async (member: any) => {
          const memberRef = doc(FirestoreDB, "managers", member.user.id);
          const memberDoc = await getDoc(memberRef);
          const memberData = {
            ...memberDoc.data(),
            email: memberDoc.data()?.email,
            managerId: member.user.id,
          };
          if (memberData && memberData.email) {
            return memberData;
          } else {
            return null;
          }
        })
      );
      const validMembers = memberData.filter((data) => data !== null);

      // Set the filtered members
      setMembers(validMembers);

      setMembersFromBrand(validMembers);
      setLoading(false);
    } catch (e) {
      CrashLog.error(e);
    }
  };

  useEffect(() => {
    fetchMembersFromClient();
  }, [user?.id]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Members
        </Text>
      </View>
      {loading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <ActivityIndicator size="small" color={Colors(theme).primary} />
        </View>
      )}
      <FlatList
        data={members}
        renderItem={({ item }) => <MembersCard manager={item} />}
        contentContainerStyle={{
          gap: 10,
        }}
      />
    </View>
  );
};

export default MemberContainer;
