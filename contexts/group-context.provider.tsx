import { IMessages } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Groups } from "@/types/Groups";
import { AuthApp } from "@/utils/auth";
import { FirestoreDB } from "@/utils/firestore";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { createContext, useContext, type PropsWithChildren } from "react";

interface Messages {
  hasNext: boolean;
  lastMessage: DocumentSnapshot | null,
  messages: IMessages[];
};

interface GroupContextProps {
  getGroupsByUserId: (userId: string) => Promise<Groups[] | null>;
  getGroupByGroupId: (groupId: string) => Promise<Groups | null>;
  getMessagesByGroupId: (groupId: string, after: any) => Promise<Messages>;
}

const GroupContext = createContext<GroupContextProps>({
  getGroupsByUserId: (userId: string) => Promise.resolve(null),
  getGroupByGroupId: (groupId: string) => Promise.resolve(null),
  getMessagesByGroupId: (groupId: string, after: any) => Promise.resolve({
    hasNext: false,
    lastMessage: null,
    messages: [],
  }),
});

export const useGroupContext = () => useContext(GroupContext);

export const GroupContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const getGroupsByUserId = async (userId: string): Promise<Groups[]> => {
    await signInAnonymously(AuthApp);
    try {
      const groupsRef = collection(FirestoreDB, "groups");

      const groupsQuery = query(
        groupsRef,
        where("userIds", "array-contains", userId),
      );

      const querySnapshot = await getDocs(groupsQuery);

      const groups: Groups[] = [];

      for (const groupDoc of querySnapshot.docs) {
        const groupData = groupDoc.data() as Groups;

        groupData.id = groupDoc.id;

        const messagesRef = collection(groupDoc.ref, "messages");
        const messagesQuery = query(messagesRef, orderBy("timeStamp", "desc"), limit(1));
        const messagesSnapshot = await getDocs(messagesQuery);

        let latestMessage: IMessages | null = null;
        if (!messagesSnapshot.empty) {
          latestMessage = messagesSnapshot.docs[0].data() as IMessages;
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
        });
      }

      return groups;
    } catch (error) {
      console.error("Error fetching groups: ", error);
      return [];
    }
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

  return (
    <GroupContext.Provider
      value={{
        getGroupByGroupId,
        getGroupsByUserId,
        getMessagesByGroupId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
