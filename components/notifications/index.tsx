import Colors from "@/shared-uis/constants/Colors";
import { Notification } from "@/types/Notification";
import { Theme, useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NotificationCard } from "../NotificationCard";
import { View } from "../theme/Themed";
import EmptyState from "../ui/empty-state";



interface NotificationsProps {
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
    onRefresh: () => void | Promise<void>;
    refreshing: boolean;
    onEndReached: () => void;
    isLoadingMore: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({
    notifications,
    onMarkAsRead,
    onRefresh,
    refreshing,
    onEndReached,
    isLoadingMore,
}) => {
    const theme = useTheme();
    const styles = stylesFn(theme);
    const [visibleCount, setVisibleCount] = useState(20);

    const visibleNotifications = useMemo(
        () => notifications.slice(0, Math.min(visibleCount, notifications.length)),
        [notifications, visibleCount]
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const totalScrollableHeight = Math.max(contentSize.height - layoutMeasurement.height, 1);
        const scrollProgress = contentOffset.y / totalScrollableHeight;

        if (scrollProgress < 0.9) {
            return;
        }

        // If backend pagination exists, fetch next page near the bottom.
        onEndReached();

        // If data is already loaded in memory, reveal more items progressively.
        setVisibleCount((prev) => {
            if (prev >= notifications.length) return prev;
            return Math.min(prev + 20, notifications.length);
        });
    };

    return (
        <>
            {
                notifications.length === 0 ? (
                    <View style={styles.container}>
                        <EmptyState
                            hideAction
                            image={require("@/assets/images/illustration2.png")}
                            subtitle="We have no notifications for you today!"
                            title="You are all caught up! "
                        />
                    </View>
                ) : (
                    <FlatList
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}
                        data={visibleNotifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <NotificationCard
                                // avatar="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
                                data={{
                                    collaborationId: item.data?.collaborationId,
                                    groupId: item.data?.groupId,
                                    userId: item.data?.userId,
                                }}
                                type={item.type}
                                description={item.description}
                                isRead={item.isRead}
                                onMarkAsRead={() => onMarkAsRead(item.id)}
                                time={item.timeStamp}
                                title={item.title}
                            />
                        )}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onEndReachedThreshold={0.1}
                        onEndReached={onEndReached}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View style={styles.footer}>
                                    <ActivityIndicator
                                        size="small"
                                        color={Colors(theme).primary}
                                    />
                                </View>
                            ) : null
                        }
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                    />
                )
            }
        </>
    );
};

export default Notifications;

export const stylesFn = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors(theme).background,
    },
    contentContainer: {
        gap: 16,
        paddingBottom: 24,
    },
    footer: {
        paddingTop: 12,
        paddingBottom: 24,
    },
});