import { Groups } from "@/types/Groups";
import MessageCard from "./MessageCard";
import { ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";

interface GroupProps {
  changeGroup: (groupId: string) => void;
  groups: Groups[];
}

const Group: React.FC<GroupProps> = ({
  changeGroup,
  groups,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<Groups[]>([]);

  const onPress = (groupId: string) => {
    changeGroup(groupId);
  }

  useEffect(() => {
    setFilteredGroups(
      groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [groups, searchQuery]);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 10,
      }}
    >
      <Searchbar
        onChangeText={setSearchQuery}
        placeholder="Search"
        value={searchQuery}
        style={{
          backgroundColor: Colors.regular.platinum,
          marginHorizontal: 10,
        }}
      />
      {filteredGroups.map((group) => (
        <MessageCard
          group={group}
          key={group.id}
          onPress={() => onPress(group.id)}
        />
      ))}
    </ScrollView>
  );
};

export default Group;
