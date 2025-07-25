import { useAuthContext } from "@/contexts"
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore"
import { collection, collectionGroup, onSnapshot, query, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"


const InviteContext = createContext<{
    influencerCount: number
    brandCount: number
}>({
    brandCount: 0,
    influencerCount: 0
})

export const useInviteContext = () => useContext(InviteContext)

export const InviteContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [brandInvites, setBrandInvites] = useState(0)
    const [influencerInvites, setInfluencerInvites] = useState(0)
    const { user } = useAuthContext()

    useEffect(() => {
        if (!user) return;
        fetchInfluencerInvites()
        fetchBrandInvites()
    }, [user])

    const fetchInfluencerInvites = async () => {
        // Logic to fetch invites goes here
        const invitationCol = collection(FirestoreDB, "users", (user?.id || ""), "invitations");
        const querySnap = query(invitationCol, where("status", "==", 0));
        onSnapshot(querySnap, (snapshot) => {
            setInfluencerInvites(snapshot.size)
        })
    }
    const fetchBrandInvites = async () => {
        // Logic to fetch invites goes here
        const invitationCol = collectionGroup(FirestoreDB, "invitations");
        const querySnap = query(invitationCol, where("userId", "==", user?.id), where("status", "==", "pending"));
        onSnapshot(querySnap, (snapshot) => {
            setBrandInvites(snapshot.size)
        })
    }
    return <InviteContext.Provider value={{
        influencerCount: influencerInvites,
        brandCount: brandInvites
    }}>
        {children}
    </InviteContext.Provider>
}