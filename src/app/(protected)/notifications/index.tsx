import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';
import { getNotificationsByUserId, setReadNotification } from '~/services/notificationServices';
import moment from 'moment';
import { useAuth } from '~/hooks/useAuth';
import { useRouter } from 'expo-router';

interface NotificationData {
    id: string;
    time: string;
    is_read: boolean;
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Fetch notifications when the component mounts
        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsByUserId(user?.uid ?? "");

                // Convert Firestore timestamps to a readable format
                const formattedNotifications = data.map((notification) => ({
                    id: notification.id,
                    time: moment(notification.created_at.toDate()).fromNow(),
                    is_read: notification.is_read,
                }));

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Check if user is loaded and not loading
        if (user && !loading) {
            fetchNotifications();
        }
    }, [user, loading]); // Fetch when the user changes or loading state changes

    const handleReadNotification = async (notification: NotificationData) => {
        try {
            if (!notification.is_read) {
                // Update the local state first
                setNotifications((prevNotifications) =>
                    prevNotifications.map((n) =>
                        n.id === notification.id ? { ...n, is_read: true } : n
                    )
                );
    
                // Update the server-side state
                await setReadNotification(user.uid, notification.id, true);
            }
    
            // Navigate to the notification's details page
            router.push(`/notifications/${notification.id}`);
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };
    

    const renderNotification = ({ item, index }: { item: NotificationData, index: number }) => (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: item.is_read ? '#ffffff' : '#f7f7f7' }}
            onPress={() => handleReadNotification(item)}
        >
            <Bell size={24} color="#ff0000" />
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>Motion detected</Text>
                <Text style={{ fontSize: 12, color: '#777', marginTop: 4 }}>{item.time}</Text>
            </View>
            <ChevronRight size={24} color="#666" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className='flex-1 bg-background'>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}
