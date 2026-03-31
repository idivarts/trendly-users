import ReadMore from "@/shared-uis/components/ReadMore";
import { DateArg } from "date-fns";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { useCollaborationDetailSurfaceStyles } from "./useCollaborationDetailSurfaceStyles";

type Props = {
    title: string;
    timeStamp?: DateArg<Date> | null;
    description: string;
    formatTimeToNow: (date: DateArg<Date>) => string;
};

const CollaborationDetailTitleBlock = ({
    title,
    timeStamp,
    description,
    formatTimeToNow,
}: Props) => {
    const styles = useCollaborationDetailSurfaceStyles();

    return (
        <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
                <Text variant="headlineMedium" style={styles.name}>
                    {title}
                </Text>
                {timeStamp != null && timeStamp !== undefined ? (
                    <Text style={styles.timestamp}>
                        {formatTimeToNow(timeStamp)}
                    </Text>
                ) : null}
            </View>
            <View style={styles.descriptionWrap}>
                <ReadMore text={description || ""} style={styles.shortDescription} />
            </View>
        </View>
    );
};

export default CollaborationDetailTitleBlock;
