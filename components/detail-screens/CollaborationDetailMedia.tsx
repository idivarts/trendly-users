import { useBreakpoints } from "@/hooks";
import { processRawAttachment } from "@/shared-libs/utils/attachments";
import Carousel from "@/shared-uis/components/carousel/carousel";
import ScrollMedia from "@/shared-uis/components/carousel/scroll-media";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";

type Props = {
    attachments?: readonly unknown[] | null;
    mediaWrapStyle?: object;
};

const CollaborationDetailMedia = ({ attachments, mediaWrapStyle }: Props) => {
    const theme = useTheme();
    const { xl } = useBreakpoints();

    const styles = useMemo(
        () =>
            StyleSheet.create({
                mediaWrap: {
                    alignSelf: "center",
                },
            }),
        []
    );

    if (!attachments?.length) {
        return null;
    }

    const media =
        attachments.map((attachment) => processRawAttachment(attachment)) || [];

    const useWebScroll = Platform.OS === "web" && xl;

    const inner = useWebScroll ? (
        <ScrollMedia
            media={media}
            MAX_WIDTH_WEB="100%"
            xl={xl}
            theme={theme}
            mediaRes={{ width: 300, height: 300 }}
        />
    ) : (
        <Carousel theme={theme} data={media} />
    );

    if (mediaWrapStyle) {
        return (
            <View style={[styles.mediaWrap, mediaWrapStyle]}>{inner}</View>
        );
    }

    return inner;
};

export default CollaborationDetailMedia;
