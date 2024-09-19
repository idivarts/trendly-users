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
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useLayoutEffect, useState, type PropsWithChildren } from "react";
import { useAuthContext } from "./auth-context.provider";

interface Messages {
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
      await signInAnonymously(AuthApp);

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

      groups.push({
        ...groupData,
      });
    }

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

  const fetchNextMessages = async (
    groupId: string,
    after: DocumentSnapshot,
    count?: number,
  ): Promise<Messages> => {
    await signInAnonymously(AuthApp);
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
      console.error("Error fetching messages: ", error);
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
    await signInAnonymously(AuthApp);
    try {
      const groupRef = doc(FirestoreDB, "groups", groupId);

      const messagesRef = collection(groupRef, "messages");
      const messagesQuery = count ? query(messagesRef, orderBy("timeStamp", "desc"), limit(count)) : query(messagesRef, orderBy("timeStamp", "desc"));
      const messagesSnapshot = await getDocs(messagesQuery);

      return {
        hasNext: messagesSnapshot.docs.length === count,
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

  const addMessageToGroup = async (
    groupId: string,
    message: Partial<IMessages>,
  ) => {
    await signInAnonymously(AuthApp);
    try {
      const groupDoc = doc(FirestoreDB, "groups", groupId);
      const groupSnap = await getDoc(groupDoc);
      const messagesRef = collection(groupSnap.ref, "messages");
      await addDoc(messagesRef, message);
      await updateDoc(groupDoc, {
        latestMessage: message,
        updatedAt: message.timeStamp,
      });
    } catch (error) {
      console.error("Error adding message: ", error);
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
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
