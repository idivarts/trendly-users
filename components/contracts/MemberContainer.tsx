import { useTheme } from "@react-navigation/native";
import { Text, View } from "../theme/Themed";
import { FC, useEffect } from "react";
import { Button } from "react-native-paper";
import Colors from "@/constants/Colors";
import React from "react";
import { faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { useChatContext } from "@/contexts";
import { doc, getDoc } from "firebase/firestore";
import { FirestoreDB } from "@/utils/firestore";
import { FlatList, Pressable } from "react-native";
import MembersCard from "./members-card";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
  const [members, setMembers] = React.useState<any[]>([]);

  const fetchMembersFromClient = async () => {
    try {
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMembersFromClient();
  }, []);

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
