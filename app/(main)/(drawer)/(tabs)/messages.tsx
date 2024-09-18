import Group from '@/components/messages';
import { View } from '@/components/theme/Themed';
import { useGroupContext } from '@/contexts';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const GroupsScreen = () => {
  const router = useRouter();
  const {
    groups,
  } = useGroupContext();

  const changeGroup = (id: string) => {
    router.push(`/chat?id=${id}`);
  };

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
