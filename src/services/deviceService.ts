import { app } from "~/firebase/firebaseConfig";
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

const getListDeviceByUserId = async (userId: string) => {
    try {
        if (!userId) {
            console.log('User ID is not provided.');
            return [];
        }

        const devicesRef = collection(db, 'users', userId, 'devices');
        const devicesSnapshot = await getDocs(devicesRef);

        if (devicesSnapshot.empty) {
            console.log('No devices found for this user.');
            return [];
        }

        // Loop through the documents and add only the 'id' and 'installed_at' fields to the array
        const devices: any[] = [];
        devicesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            devices.push({
                id: doc.id,
                installed_at: data.installed_at,
                device_name: data.name
            });
        });

        return devices;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};

const getDeviceByDeviceId = async (userId: string, deviceId: string) => {
    try {
        // Check if userId or deviceId is not provided
        if (!userId || !deviceId) {
            console.log('User ID or Device ID is not provided.');
            return null; // Return null if either userId or deviceId is missing
        }

        // Reference to the specific device document
        const deviceRef = doc(db, 'users', userId, 'devices', deviceId);

        // Fetch the device document
        const deviceDoc = await getDoc(deviceRef);

        // Check if the document exists
        if (!deviceDoc.exists()) {
            console.log('Device not found.');
            return null; // Return null if the device does not exist
        }

        // Return the device data along with its document ID
        return { id: deviceDoc.id, ...deviceDoc.data() };

    } catch (error) {
        console.error('Error fetching device:', error);
        throw error; // Throw the error if something goes wrong
    }
}

export { getListDeviceByUserId }