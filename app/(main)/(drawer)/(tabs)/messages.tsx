import Group from '@/components/messages';
import { View } from '@/components/theme/Themed';
import { useGroupContext } from '@/contexts';
import { Groups } from '@/types/Groups';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

const GroupsScreen = () => {
  const [groups, setGroups] = useState<Groups[] | null>(null);
  const router = useRouter();
  const {
    getGroupsByUserId,
  } = useGroupContext();

  const changeGroup = (id: string) => {
    router.push(`/chat?id=${id}`);
  };

  const fetchGroupsByUserId = async () => {
    const groups = await getGroupsByUserId("IjOAHWjc3d8ff8u6Z2rD"); // TODO: get user id from auth context

    setGroups(groups);
  };

  useEffect(() => {
    fetchGroupsByUserId();
  }, []);

  if (!groups) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <Group
      changeGroup={changeGroup}
      groups={groups}
    />
  );
}

export default GroupsScreen;
