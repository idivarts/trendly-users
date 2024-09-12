import { IGroups } from "@/shared-libs/firestore/trendly-pro/models/groups";
import { Groups } from "@/types/Groups";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs, orderBy, getDoc, doc } from "firebase/firestore"; // Import necessary Firestore methods
import { createContext, useContext, type PropsWithChildren } from "react";

interface GroupContextProps {
  getGroupsByUserId: (userId: string) => Promise<Groups[] | null>;
}

const GroupContext = createContext<GroupContextProps>({
  getGroupsByUserId: (userId: string) => Promise.resolve(null),
});

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const useGroupContext = () => useContext(GroupContext);

export const GroupContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const getGroupsByUserId = async (userId: string): Promise<Groups[]> => {
    try {
      const groupsRef = collection(db, "groups");

      const groupsQuery = query(
        groupsRef,
        where("userIds", "array-contains", userId),
        orderBy("messages.timeStamp", "desc") // Sort based on latest message timestamp
      );

      const querySnapshot = await getDocs(groupsQuery);

      const groups: Groups[] = [];

      for (const groupDoc of querySnapshot.docs) {
        const groupData = groupDoc.data() as Groups;

        groupData.id = groupDoc.id;

        // Fetch and populate collaboration details if available
        if (groupData.collaborationId) {
          const collaborationRef = doc(db, "collaborations", groupData.collaborationId);
          const collaborationSnap = await getDoc(collaborationRef);
          if (collaborationSnap.exists()) {
            groupData.collaboration = collaborationSnap.data();
          }
        }

        groups.push(groupData);
      }

      return groups;
    } catch (error) {
      console.error("Error fetching groups: ", error);
      return [];
    }
  };

  return (
    <GroupContext.Provider
      value={{
        getGroupsByUserId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
