import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { MapPin, Cctv, Clock } from "lucide-react-native";
import { useRoute } from '@react-navigation/native';
import { useAuth } from '~/hooks/useAuth';
import { getNotificationDetailById } from '~/services/notificationServices';
import { Timestamp } from "firebase/firestore";

export default function NotificationDetail() {
    const [notification, setNotification] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasLoggedUser, setHasLoggedUser] = useState(false);

    const { user, loading } = useAuth();
    const route = useRoute();
    const notificationId = route.params?.id ?? "";

    useEffect(() => {
        if (!loading && user && !hasLoggedUser) {
            setHasLoggedUser(true); 
        }
    }, [user, loading, hasLoggedUser]);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const data = await getNotificationDetailById(user?.uid ?? "", notificationId);
                setNotification(data);
            } catch (err) {
                console.error("Error fetching notification detail:", err);
                setError("Failed to load notification details.");
            }
        };

        if (user && !loading && notificationId) {
            fetchNotification();
        }
    }, [notificationId, user, loading]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <Text className="text-foreground">Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <Text className="text-destructive">{error}</Text>
            </SafeAreaView>
        );
    }

    const createdAt = notification?.created_at;
    let formattedDate = null;

    if (createdAt instanceof Timestamp) {
        formattedDate = createdAt.toDate().toLocaleString();
    } else if (createdAt) {
        formattedDate = new Date(createdAt).toLocaleString();
    } else {
        formattedDate = 'Unknown date';
    }

    const imageSource = notification?.img
        ? { uri: notification?.img }
        : null;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1">
                <View className="relative w-full aspect-video bg-muted">
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-muted-foreground">Image not available</Text>
                        </View>
                    )}
                </View>

                <View className="p-4 space-y-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <MapPin size={18} color={'#666'} />
                            <Text className="ml-2 text-base font-medium text-foreground">
                                {notification?.device?.installed_at || 'Unknown location'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Clock size={16} className="text-muted-foreground mr-1" />
                            <Text className="text-sm text-muted-foreground">
                                {formattedDate}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <Cctv size={18} color={'#666'} />
                        <Text className="ml-2 text-base text-foreground">
                            {notification?.device?.name || 'Unknown device'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}