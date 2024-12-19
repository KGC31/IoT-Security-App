import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Bell } from "lucide-react-native";
import { getWriteKey, getReadKey } from "~/services/authServices";
import { useAuth } from "~/hooks/useAuth";

export default function AlertButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, loading } = useAuth();

    const fetchData = async () => {
        try {
            const readKey = (await getReadKey(user?.uid || "")).payload;
            
            const response = await fetch(
                `https://api.thingspeak.com/channels/2779475/fields/1.json?api_key=${readKey}&results=1`
            );
            const json = await response.json();

            if (json.feeds && json.feeds.length > 0) {
                const latestFeed = json.feeds[0];
                const fieldValue = latestFeed.field1;
                const createdAt = new Date(latestFeed.created_at);
                const now = new Date();
                const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;

                // Set visibility based on conditions
                if (fieldValue === "1" && diffMinutes <= 2) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(false);
            }
        } catch (err) {
            setError("Failed to fetch data.");
            setIsVisible(false);
        }
    };

    const updateFieldToZero = async () => {
        let attempts = 0;
        const maxAttempts = 5;

        try {
            const writeKey = (await getWriteKey(user?.uid || "")).payload;
            const readKey = (await getReadKey(user?.uid || "")).payload;
            
            while (attempts < maxAttempts) {
                // Update the field to 0
                await fetch(
                    `https://api.thingspeak.com/update?api_key=${writeKey}&field1=0`
                );

                // Verify the field has been updated
                const response = await fetch(
                    `https://api.thingspeak.com/channels/2779475/fields/1.json?api_key=${readKey}&results=1`
                );
                const json = await response.json();

                if (json.feeds && json.feeds.length > 0) {
                    const latestFeed = json.feeds[0];
                    const fieldValue = latestFeed.field1;

                    // Check if the field has been updated to "0"
                    if (fieldValue === "0") {
                        setIsVisible(false); // Hide the button after successful update
                        setError(null); // Clear any previous error
                        return;
                    }
                }

                attempts++;
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }

            setError("Failed to update field after multiple attempts.");
        } catch (err) {
            setError("Error during update field operation.");
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, 500); // Fetch data every 500ms

        return () => {
            clearInterval(intervalId); // Clear interval on unmount
        };
    }, [user, loading]);

    return (
        <>
            {isVisible && (
                <TouchableOpacity
                    className="bg-red-600 p-2 m-2 rounded-full"
                    onPress={updateFieldToZero}
                >
                    <View className="flex-row justify-center items-center gap-2">
                        <Bell size={20} color="#fff" />
                        <Text className="text-white text-md font-bold ml-2">
                            MOTION DETECTED
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
            {error && (
                <Text className="text-red-500 text-center mt-2">{error}</Text>
            )}
        </>
    );
}
