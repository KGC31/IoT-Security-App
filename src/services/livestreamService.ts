import { getDatabase, get, ref, child, onValue, off } from 'firebase/database';
import { app } from '~/firebase/firebaseConfig';

export const livestreamService = (userId: string, deviceId: string, callback: (base64Image: string) => void) => {
    // Get the database instance
    const database = getDatabase(app);
    const dbRef = ref(database);    

    // Reference to the device data
    const deviceRef = child(dbRef, `users/${userId}/devices/${deviceId}`);

    // Fetch the initial data (once)
    const fetchDeviceData = async () => {
        try {
            const snapshot = await get(deviceRef);
            if (snapshot.exists()) {
                const deviceData = snapshot.val();
                if (deviceData && deviceData.livestream) {
                    callback(deviceData.livestream);
                }
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Listen for real-time updates
    const listenForUpdates = () => {
        onValue(deviceRef, (snapshot) => {
            if (snapshot.exists()) {
                const deviceData = snapshot.val();
                if (deviceData && deviceData.livestream) {
                    callback(deviceData.livestream);
                }
            } else {
                console.log("No data available");
            }
        });
    };

    // Call both functions
    fetchDeviceData();
    listenForUpdates();

    return () => {
        off(deviceRef); // Unsubscribe from real-time updates
    };
};
