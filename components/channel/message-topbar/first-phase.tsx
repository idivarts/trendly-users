import React, { useRef } from "react";
import QuotationModal from "@/components/modals/quotation-modal";
import { View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import { CHAT_MESSAGE_TOPBAR_DESCRIPTION } from "@/constants/ChatMessageTopbar";
import MessageTopbar from "@/shared-uis/components/chat-message-bar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const FirstPhase = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
                // TODO: Trigger a system message
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

      <QuotationModal
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
}

export default FirstPhase;
