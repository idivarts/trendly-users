import { addDoc, collection, Firestore } from "firebase/firestore";

export const populateGroups = async (db: Firestore, dummyGroups: any[]) => {
  if (!Array.isArray(dummyGroups)) {
    throw new Error("Groups must be an array.");
  }

  const groupsCollection = collection(db, "groups");

  for (const group of dummyGroups) {
    if (
      !group.name ||
      !group.collaborationId ||
      !group.userIds ||
      !group.managerIds ||
      !group.lastManagerReadTime ||
      !group.lastUserReadTime
    ) {
      throw new Error(`Invalid group data: ${JSON.stringify(group)}`);
    }

    try {
      const groupRef = await addDoc(groupsCollection, {
        name: group.name,
        collaborationId: group.collaborationId,
        userIds: group.userIds,
        managerIds: group.managerIds,
        latestMessage: group.latestMessage,
        updatedAt: group.updatedAt,
        lastUserReadTime: group.lastUserReadTime,
        lastManagerReadTime: group.lastManagerReadTime,
      });

      console.log(`Group ${group.name} added successfully.`);

      const messagesCollection = collection(groupRef, "messages");

      if (group.messages && group.messages.length > 0) {
        for (const message of group.messages) {
          await addDoc(messagesCollection, {
            groupId: groupRef.id,
            senderId: message.senderId,
            message: message.message,
            userType: message.userType,
            attachments: message.attachments,
            timeStamp: message.timeStamp,
          });
        }
      }

      console.log(`Messages for group ${group.name} added successfully.`);
    } catch (error) {
      console.error(`Error adding group ${group.name}:`, error);
    }
  }
};
