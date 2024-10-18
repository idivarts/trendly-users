import { Groups } from "@/types/Groups";
import MessageCard from "./MessageCard";
import { ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import EmptyState from "../ui/empty-state";

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
  const theme = useTheme();

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
        paddingVertical: 20,
        backgroundColor: Colors(theme).background,
      }}
    >
      <Searchbar
        onChangeText={setSearchQuery}
        placeholder="Search"
        value={searchQuery}
        style={{
          backgroundColor: Colors(theme).platinum,
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      />
      {
        filteredGroups.length === 0 ? (
          <EmptyState
            title="No groups found"
            hideAction
          />
        ) : (
          filteredGroups.map((group) => (
            <MessageCard
              group={group}
              key={group.id}
              onPress={() => onPress(group.id)}
            />
          ))
        )
      }
    </ScrollView>
  );
};

export default Group;
