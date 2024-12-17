import React, { useEffect, useState } from "react";
import { Switch, View, Text, ActivityIndicator, Alert } from "react-native";
import { Settings2 } from "lucide-react-native";

export default function MotionToggle() {
    const [isMotionEnabled, setIsMotionEnabled] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the current value of field2 from ThingSpeak
    const fetchSensorStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'https://api.thingspeak.com/channels/2779475/fields/2.json?api_key=Z7W5RRPGEW0BVIBD&results=1'
            );
            const json = await response.json();

            if (json.feeds && json.feeds.length > 0) {
                const latestFeed = json.feeds[0];
                const fieldValue = latestFeed.field2;
                setIsMotionEnabled(fieldValue === "1");
            } else {
                setError("No data available.");
            }
        } catch (err) {
            setError("Failed to fetch sensor status.");
            Alert.alert("Error", "Unable to fetch motion sensor status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Update field2 on ThingSpeak with retry logic
    const updateSensorStatus = async (value: boolean) => {
        const maxRetries = 5;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const response = await fetch(
                    `https://api.thingspeak.com/update?api_key=PTJ35MQNU5N8Z1RM&field2=${value ? 1 : 0}`
                );

                if (response.ok) {
                    setError(null); // Clear error on success
                    return; // Exit loop on successful update
                }

                throw new Error("Failed to update sensor status.");
            } catch (err) {
                attempt++;
                if (attempt >= maxRetries) {
                    setError("Failed to update sensor status after multiple attempts.");
                    Alert.alert("Error", "Unable to update motion sensor status after multiple attempts. Please try again.");
                } else {
                    // Wait for 1 second before retrying
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
        }
    };

    // Handle switch toggle
    const handleToggle = (value: boolean) => {
        setIsMotionEnabled(value);
        updateSensorStatus(value);
    };

    // Fetch initial value on mount
    useEffect(() => {
        fetchSensorStatus();
    }, []);

    return (
        <View className="flex-row justify-between items-center mb-6 bg-background">
            <View className="flex-row items-center gap-2">
                <Settings2 size={24} color="#000" />
                <Text className="text-md text-foreground">Motion sensor</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="small" color="#81b0ff" />
            ) : (
                <Switch
                    value={isMotionEnabled ?? false} // Default to false if null
                    onValueChange={handleToggle}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isMotionEnabled ? "#f4f3f4" : "#f4f3f4"}
                />
            )}
        </View>
    );
}
