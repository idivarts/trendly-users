import React, { useEffect, useRef, useState } from "react";
import QuotationBottomSheet from "@/components/modals/quotation-bottom-sheet";
import { View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import { CHAT_MESSAGE_TOPBAR_DESCRIPTION } from "@/constants/ChatMessageTopbar";
import MessageTopbar from "@/shared-uis/components/chat-message-bar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useChatContext, useCollaborationContext } from "@/contexts";
import { Contract } from "@/types/Contract";
import { IApplications } from "@/shared-libs/firestore/trendly-pro/models/collaborations";

interface FirstPhaseProps {
  contract: Contract;
}

const FirstPhase: React.FC<FirstPhaseProps> = ({
  contract,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [application, setApplication] = useState<IApplications | null>(null);
  const [quotation, setQuotation] = useState("");
  const [timeline, setTimeline] = useState<Date | null>(null);

  const {
    sendSystemMessage
  } = useChatContext();

  const {
    getApplicationById,
    updateApplication,
  } = useCollaborationContext();

  const fetchApplication = async () => {
    const application = await getApplicationById(contract.userId, contract.collaborationId);
    setApplication(application);
    setQuotation(application?.quotation || "");
    setTimeline(application?.timeline ? new Date(application?.timeline) : null);
  };

  useEffect(() => {
    fetchApplication();
  }, [contract]);

  const handleUpdateApplication = async (
    data: {
      quotation: string,
      timeline: number
    }
  ) => {
    if (!application) return;

    await updateApplication(
      contract.userId,
      contract.collaborationId,
      data
    ).then(() => {
      fetchApplication();
      sendSystemMessage(contract.id, "The Quotation for this collaboration is revised.");
      bottomSheetModalRef.current?.close();
    });
  }

  return (
    <>
      <MessageTopbar
        actions={
          <View
            style={{
              flexDirection: 'row-reverse',
              gap: 16,
              justifyContent: 'space-between',
            }}
          >
            <Button
              size="small"
              mode="text"
              onPress={() => {
                sendSystemMessage(contract.id, "Start Contract");
              }}
            >
              Start Contract
            </Button>
            <Button
              size="small"
              mode="text"
              onPress={() => {
                bottomSheetModalRef.current?.present();
              }}
            >
              Revise Quotation
            </Button>
          </View>
        }
        description={CHAT_MESSAGE_TOPBAR_DESCRIPTION.first}
      />

      <QuotationBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        onSubmit={handleUpdateApplication}
        state={{
          quotation,
          timeline,
        }}
        setState={{
          quotation: setQuotation,
          timeline: setTimeline,
        }}
      />
    </>
  );
}

export default FirstPhase;
