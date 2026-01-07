import { Console } from "@/shared-libs/utils/console";
import { addDoc, collection, Firestore } from "firebase/firestore";

export const populateGroups = async (db: Firestore, dummyGroups: any[]) => {
    const groupsCollection = collection(db, "groups");

    for (const group of dummyGroups) {
        const groupRef = await addDoc(groupsCollection, {
            name: group.name,
            collaborationId: group.collaborationId,
            userIds: group.userIds,
            managerIds: group.managerIds,
        });

        Console.log(`Group ${group.name} added successfully.`);

        const messagesCollection = collection(groupRef, "messages");

        if (group.messages && group.messages.length > 0) {
            for (const message of group.messages) {
                await addDoc(messagesCollection, {
                    groupId: groupRef.id,
                    senderId: message.senderId,
                    message: message.message,
                    attachments: message.attachments,
                    timeStamp: message.timeStamp,
                });
            }
        }

        Console.log(`Messages for group ${group.name} added successfully.`);
    }
};
