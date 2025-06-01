import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Console } from "@/shared-libs/utils/console";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import { Groups } from "@/types/Groups";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuthContext } from "./auth-context.provider";
;

interface Messages {
  firstMessage?: DocumentSnapshot | null;
  hasNext: boolean;
  lastMessage: DocumentSnapshot | null,
  messages: IMessages[];
};

interface GroupContextProps {
  addMessageToGroup: (groupId: string, message: Partial<IMessages>) => Promise<void>;
  fetchNextMessages: (
    groupId: string,
    after: DocumentSnapshot,
    count?: number,
  ) => Promise<Messages>;
  getGroupByGroupId: (groupId: string) => Promise<Groups | null>;
  getMessagesByGroupId: (
    groupId: string,
    count?: number,
  ) => Promise<Messages>;
  groups: Groups[] | null;
  updateGroup: (groupId: string, group: Partial<Groups>) => Promise<void>;
}

const GroupContext = createContext<GroupContextProps>({
  addMessageToGroup: (groupId: string, message: Partial<IMessages>) => Promise.resolve(),
  fetchNextMessages: (groupId: string, after: DocumentSnapshot, count?: number) => Promise.resolve({
    hasNext: false,
    lastMessage: null,
    messages: [],
  }),
  getGroupByGroupId: (groupId: string) => Promise.resolve(null),
  getMessagesByGroupId: (
    groupId: string,
    count?: number,
  ) => Promise.resolve({
    hasNext: false,
    lastMessage: null,
    messages: [],
  }),
  groups: null,
  updateGroup: (groupId: string, group: Partial<Groups>) => Promise.resolve(),
});

export const useGroupContext = () => useContext(GroupContext);

export const GroupContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [groups, setGroups] = useState<Groups[] | null>(null);

  const {
    user,
  } = useAuthContext();

  useLayoutEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchGroupsByUserId = async (userId: string) => {
      const groupsRef = collection(FirestoreDB, "groups");

      const groupsQuery = query(
        groupsRef,
        where("userIds", "array-contains", userId),
        orderBy("updatedAt", "desc"),
      );

      unsubscribe = onSnapshot(groupsQuery, async (querySnapshot) => {
        const groups = await getGroupsAndSortByLatestMessage(querySnapshot);
        setGroups(groups);
      });
    };

    fetchGroupsByUserId(user?.id || "");

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.id]);

  const getGroupsAndSortByLatestMessage = async (
    snapshot: QuerySnapshot<DocumentData, DocumentData>,
  ): Promise<Groups[]> => {
    const groups: Groups[] = [];

    for (const groupDoc of snapshot.docs) {
      const groupData = groupDoc.data() as Groups;
      groupData.id = groupDoc.id;

      // Fetch and populate collaboration details if available
      if (groupData.collaborationId) {
        const collaborationRef = doc(FirestoreDB, "collaborations", groupData.collaborationId);
        const collaborationSnap = await getDoc(collaborationRef);
        if (collaborationSnap.exists()) {
          groupData.collaboration = collaborationSnap.data();
        }
      }

      const userLastReadTime = groupData.lastUserReadTime?.[user?.id as string];

      const time = userLastReadTime ? userLastReadTime : 0;

      groups.push({
        ...groupData,
        isUnreadMessages: time < groupData.updatedAt,
      });
    }

    return groups;
  };

  const getGroupByGroupId = async (groupId: string): Promise<Groups | null> => {
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      const groupSnap = await getDoc(groupDoc);

      if (!groupSnap.exists()) {
        return null;
      }

      const groupData = groupSnap.data() as Groups;
      groupData.id = groupSnap.id;

      if (groupData.collaborationId) {
        const collaborationRef = doc(FirestoreDB, "collaborations", groupData.collaborationId);
        const collaborationSnap = await getDoc(collaborationRef);
        if (collaborationSnap.exists()) {
          groupData.collaboration = collaborationSnap.data();
        }
      }

      const users: any = {};
      const managers: any = {};

      for (const userId of groupSnap.data().userIds) {
        const userDoc = doc(FirestoreDB, "users", userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData) {
            users[userSnap.id] = userData;
          }
        }
      }

      for (const managerId of groupSnap.data().managerIds) {
        const managerDoc = doc(FirestoreDB, "managers", managerId);
        const managerSnap = await getDoc(managerDoc);

        if (managerSnap.exists()) {
          const managerData = managerSnap.data();
          if (managerData) {
            managers[managerSnap.id] = managerData;
          }
        }
      }

      groupData.users = users;
      groupData.managers = managers

      return groupData;
    } catch (error) {
      Console.error(error, "Error fetching group: ");
      return null;
    }
  };

  const fetchNextMessages = async (
    groupId: string,
    after: DocumentSnapshot,
    count?: number,
  ): Promise<Messages> => {
    try {
      const groupRef = doc(FirestoreDB, "groups", groupId);

      const messagesRef = collection(groupRef, "messages");
      const messagesQuery = count ? query(messagesRef, orderBy("timeStamp", "desc"), startAfter(after), limit(count)) : query(messagesRef, orderBy("timeStamp", "desc"), startAfter(after));
      const messagesSnapshot = await getDocs(messagesQuery);

      return {
        hasNext: messagesSnapshot.docs.length === count,
        lastMessage: messagesSnapshot.docs[messagesSnapshot.docs.length - 1],
        messages: messagesSnapshot.docs.map((doc) => doc.data() as IMessages),
      }
    } catch (error) {
      Console.error(error, "Error fetching messages: ");
      return {
        hasNext: false,
        lastMessage: null,
        messages: [],
      }
    }
  };

  const fetchMessages = async (
    snapshot: QuerySnapshot<DocumentData, DocumentData>,
  ): Promise<Messages> => {
    return {
      hasNext: snapshot.docs.length === 30,
      lastMessage: snapshot.docs[snapshot.docs.length - 1],
      messages: snapshot.docs.map((doc) => doc.data() as IMessages),
    }
  }

  const getMessagesByGroupId = async (
    groupId: string,
    count?: number,
  ): Promise<Messages> => {
    try {
      const groupRef = doc(FirestoreDB, "groups", groupId);

      const messagesRef = collection(groupRef, "messages");
      const messagesQuery = count ? query(messagesRef, orderBy("timeStamp", "desc"), limit(count)) : query(messagesRef, orderBy("timeStamp", "desc"));
      const messagesSnapshot = await getDocs(messagesQuery);

      return {
        firstMessage: messagesSnapshot.docs[0],
        hasNext: messagesSnapshot.docs.length === count,
        lastMessage: messagesSnapshot.docs[messagesSnapshot.docs.length - 1],
        messages: messagesSnapshot.docs.map((doc) => doc.data() as IMessages),
      }
    } catch (error) {
      Console.error(error, "Error fetching messages: ");
      return {
        firstMessage: null,
        hasNext: false,
        lastMessage: null,
        messages: [],
      }
    }
  };

  const updateGroup = async (groupId: string, group: Partial<Groups>) => {
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      await updateDoc(groupDoc, group);
    } catch (error) {
      Console.error(error, "Error updating group: ");
    }
  }

  const addMessageToGroup = async (
    groupId: string,
    message: Partial<IMessages>,
  ) => {
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      const groupSnap = await getDoc(groupDoc);
      const messagesRef = collection(groupSnap.ref, "messages");
      await addDoc(messagesRef, message);
      await updateDoc(groupDoc, {
        latestMessage: message,
        updatedAt: message.timeStamp,
        lastUserReadTime: {
          ...groupSnap.data()?.lastUserReadTime,
          [user?.id as string]: Date.now(),
        },
      });
    } catch (error) {
      Console.error(error, "Error adding message: ");
    }
  }

  return (
    <GroupContext.Provider
      value={{
        addMessageToGroup,
        fetchNextMessages,
        getGroupByGroupId,
        getMessagesByGroupId,
        groups,
        updateGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
