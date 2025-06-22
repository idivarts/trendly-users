import { useEffect, useState } from "react";
import DownloadAppModal from "../modals/DownloadAppModal";
import DownloadPlayModal from "../modals/DownloadPlayModal";

const DownloadApp = () => {
    const [showModal, setShowModal] = useState<"ios" | "android" | undefined>(undefined);

    useEffect(() => {
        if (typeof window == "undefined")
            return;
        const userAgent = window.navigator.userAgent;
        // @ts-ignore
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /Android/i.test(userAgent);
        // @ts-ignore
        const isInBrowser = typeof window !== "undefined" && window.navigator.standalone !== true;

        if (isIOS && isInBrowser) {
            setShowModal("ios");
        }
        if (isAndroid && isInBrowser) {
            setShowModal("android");
        }
    }, []);

    if (showModal == "ios") return <DownloadAppModal />
    if (showModal == "android") return <DownloadPlayModal />

    return null;
};

export default DownloadApp 