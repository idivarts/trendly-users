import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Groups } from "@/types/Groups";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { signInAnonymously } from "firebase/auth";
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
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

interface Messages {
  hasNext: boolean;
  lastMessage: DocumentSnapshot | null,
  messages: IMessages[];
};

interface GroupContextProps {
  addMessageToGroup: (groupId: string, message: Partial<IMessages>) => Promise<void>;
  getGroupByGroupId: (groupId: string) => Promise<Groups | null>;
  getMessagesByGroupId: (groupId: string, after: any) => Promise<Messages>;
  groups: Groups[] | null;
}

const GroupContext = createContext<GroupContextProps>({
  addMessageToGroup: (groupId: string, message: Partial<IMessages>) => Promise.resolve(),
  getGroupByGroupId: (groupId: string) => Promise.resolve(null),
  getMessagesByGroupId: (groupId: string, after: any) => Promise.resolve({
    hasNext: false,
    lastMessage: null,
    messages: [],
  }),
  groups: null,
});

export const useGroupContext = () => useContext(GroupContext);

export const GroupContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [groups, setGroups] = useState<Groups[] | null>(null);
  const userId = "IjOAHWjc3d8ff8u6Z2rD"; // TODO: get user id from auth context

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchGroupsByUserId = async (userId: string) => {
      await signInAnonymously(AuthApp);

      const groupsRef = collection(FirestoreDB, "groups");

      const groupsQuery = query(
        groupsRef,
        where("userIds", "array-contains", userId)
      );

      unsubscribe = onSnapshot(groupsQuery, async (querySnapshot) => {
        const groups = await getGroupsAndSortByLatestMessage(querySnapshot);
        setGroups(groups);
      });
    };

    fetchGroupsByUserId(userId);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId]);

  const getGroupsAndSortByLatestMessage = async (
    snapshot: QuerySnapshot<DocumentData, DocumentData>,
  ): Promise<Groups[]> => {
    const groups: (Groups & { latestMessageTime?: number })[] = [];

    for (const groupDoc of snapshot.docs) {
      const groupData = groupDoc.data() as Groups;
      groupData.id = groupDoc.id;

      const messagesRef = collection(groupDoc.ref, "messages");
      const messagesQuery = query(messagesRef, orderBy("timeStamp", "desc"), limit(1));
      const messagesSnapshot = await getDocs(messagesQuery);

      let latestMessage: IMessages | null = null;
      let latestMessageTime: number | null = null;

      if (!messagesSnapshot.empty) {
        latestMessage = messagesSnapshot.docs[0].data() as IMessages;
        latestMessageTime = latestMessage.timeStamp;
      }

      // Fetch and populate collaboration details if available
      if (groupData.collaborationId) {
        const collaborationRef = doc(FirestoreDB, "collaborations", groupData.collaborationId);
        const collaborationSnap = await getDoc(collaborationRef);
        if (collaborationSnap.exists()) {
          groupData.collaboration = collaborationSnap.data();
        }
      }

      groups.push({
        ...groupData,
        latestMessage,
        latestMessageTime: latestMessageTime as number,
      });
    }

    // Sort groups by latest message time (descending)
    groups.sort((a, b) => (b.latestMessageTime || 0) - (a.latestMessageTime || 0));

    return groups;
  };

  const getGroupByGroupId = async (groupId: string): Promise<Groups | null> => {
    await signInAnonymously(AuthApp);
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
      console.error("Error fetching group: ", error);
      return null;
    }
  };

  const getMessagesByGroupId = async (groupId: string, after: IMessages): Promise<Messages> => {
    await signInAnonymously(AuthApp);
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      const groupSnap = await getDoc(groupDoc);

      if (!groupSnap.exists()) {
        return {
          hasNext: false,
          lastMessage: null,
          messages: [],
        };
      }

      const messagesRef = collection(groupSnap.ref, "messages");
      const messagesQuery = after
        ? query(messagesRef, orderBy("timeStamp", "desc"), startAfter(after), limit(30))
        : query(messagesRef, orderBy("timeStamp", "desc"), limit(30));
      const messagesSnapshot = await getDocs(messagesQuery);

      return {
        hasNext: messagesSnapshot.docs.length === 30,
        lastMessage: messagesSnapshot.docs[messagesSnapshot.docs.length - 1],
        messages: messagesSnapshot.docs.map((doc) => doc.data() as IMessages),
      }
    } catch (error) {
      console.error("Error fetching messages: ", error);
      return {
        hasNext: false,
        lastMessage: null,
        messages: [],
      }
    }
  };

  const addMessageToGroup = async (groupId: string, message: Partial<IMessages>) => {
    await signInAnonymously(AuthApp);
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      const groupSnap = await getDoc(groupDoc);
      const messagesRef = collection(groupSnap.ref, "messages");
      await addDoc(messagesRef, message);
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  }

  return (
    <GroupContext.Provider
      value={{
        addMessageToGroup,
        getGroupByGroupId,
        getMessagesByGroupId,
        groups,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
