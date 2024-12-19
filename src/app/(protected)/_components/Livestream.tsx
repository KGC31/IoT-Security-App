import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
} from 'react-native';
import { useAuth } from '~/hooks/useAuth';
import { livestreamService } from '~/services/livestreamService';
import { getListDeviceByUserId } from '~/services/deviceService';
import { Dropdown } from 'react-native-element-dropdown';
import { Skeleton } from '~/components/ui/skeleton';

interface Device {
    id: string;
    installed_at: string;
}

export default function LivestreamComponent() {
    const [currentTime, setCurrentTime] = useState<string>(''); // State for time
    const [livestreamImage, setLivestreamImage] = useState<string | null>(null); // State to hold the livestream image
    const [devices, setDevices] = useState<Device[]>([]); // State to hold list of devices
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null); // State for selected device
    const { user, loading } = useAuth();

    useEffect(() => {
        // Update current time every second
        const updateTime = () => {
            const now = new Date();
            const formattedTime = now.toISOString().replace('T', ' ').slice(0, 19);
            setCurrentTime(formattedTime);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        // Fetch devices for the user
        const fetchDevices = async () => {
            if (user) {
                try {
                    const response = await getListDeviceByUserId(user.uid);

                    if (response.has_error) {
                        console.error('Error fetching devices:', response.error);
                        return;
                    }

                    const listDevices = response.payload || [];
                    setDevices(listDevices);

                    // Set the first device as the default selected device if available
                    if (listDevices.length > 0) {
                        setSelectedDeviceId(listDevices[0].id);
                    }
                } catch (error) {
                    console.error('Unexpected error fetching devices:', error);
                }
            }
        };

        fetchDevices();
    }, [user]);

    useEffect(() => {
        // Start livestreaming if a device is selected
        if (user && selectedDeviceId) {
            const unsubscribe = livestreamService(user.uid, selectedDeviceId, updateLivestreamImage);

            // Cleanup the listener when the component unmounts
            return () => {
                unsubscribe();
            };
        }
    }, [user, selectedDeviceId]);

    // Update the image state when livestream image is received
    const updateLivestreamImage = (base64Image: string) => {
        setLivestreamImage(base64Image);
    };

    return (
        <View>
            <View className="mb-6">
                {/* Skeleton loader for dropdown while fetching devices */}
                {loading || devices.length === 0 ? (
                    <Skeleton className="h-10 w-full rounded" />
                ) : (
                    <Dropdown
                        data={devices.map(device => ({
                            label: `${device.installed_at}`,
                            value: device.id,
                        }))}
                        value={selectedDeviceId}
                        onChange={item => {
                            setSelectedDeviceId(item.value);
                        }}
                        labelField="label"
                        valueField="value"
                    />
                )}
            </View>

            <View className="relative mb-6 rounded-lg overflow-hidden">
                {/* Skeleton loader for livestream image */}
                {loading || !livestreamImage ? (
                    <Skeleton className="w-full h-48 rounded" />
                ) : (
                    <Image
                        source={{ uri: `${livestreamImage}` }}
                        className="w-full h-48 bg-gray-200"
                        resizeMode="cover"
                    />
                )}
                <View className="absolute top-2 left-2 bg-black bg-opacity-50 p-1 rounded">
                    <Text className="text-xs text-white">{currentTime}</Text>
                </View>
            </View>
        </View>
    );
}
