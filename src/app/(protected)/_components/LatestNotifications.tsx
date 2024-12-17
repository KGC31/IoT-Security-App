import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
} from 'react-native';
import { getLatestNotificationsByUserId } from '~/services/notificationServices';
import { useAuth } from '~/hooks/useAuth';
import { Skeleton } from '~/components/ui/skeleton';

interface Notification {
    id: string;
    created_at: Date; // Assuming the converted Date object
    message: string; // Add any other relevant fields
}

export default function LatestNotificationsComponent() {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.uid) return;

            try {
                setLoading(true);
                const latestNotifications = await getLatestNotificationsByUserId(user.uid);
                setNotifications(latestNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    if (authLoading || loading) {
        return (
            <SafeAreaView className="flex-1 px-4 py-6">
                <Text className="text-xl font-bold mb-4 text-foreground">Recent notification</Text>
                <View>
                    {[...Array(3)].map((_, index) => (
                        <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-300">
                            <Skeleton className="h-4 w-3/5 rounded" />
                            <Skeleton className="h-4 w-20 rounded" />
                        </View>
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className="mb-6 bg-background">
            <Text className="text-xl font-bold mb-4 text-foreground">Recent notification</Text>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <View
                        key={notification.id}
                        className="flex-row justify-between items-center py-3 border-b border-gray-300"
                    >
                        <Text className="text-md text-foreground">{notification.message || 'Motion detected'}</Text>
                        <Text className="text-sm text-gray-600">
                            {timeAgo(notification.created_at)}
                        </Text>
                    </View>
                ))
            ) : (
                <Text className="text-center text-gray-500 mt-4">
                    No recent notifications found.
                </Text>
            )}
        </View>
    );
}

// Utility function to calculate time ago
function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}
