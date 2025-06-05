import { useBreakpoints } from "@/hooks";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import DownloadAppModal from "../modals/DownloadAppModal";

const DownloadApp = () => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const { lg } = useBreakpoints()
    useEffect(() => {
        if (!bottomSheetModalRef.current)
            return;
        if (!lg) {
            bottomSheetModalRef.current?.present();
        }
    }, [lg, bottomSheetModalRef.current])

    return <DownloadAppModal
        bottomSheetModalRef={bottomSheetModalRef}
    />
}

export default DownloadApp