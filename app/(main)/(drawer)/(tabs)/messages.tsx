import Group from '@/components/messages';
import { useGroupContext } from '@/contexts';
import { Groups } from '@/types/Groups';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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
    return null;
  }

  return (
    <Group
      changeGroup={changeGroup}
      groups={groups}
    />
  );
}

export default GroupsScreen;
