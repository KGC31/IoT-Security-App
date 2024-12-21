import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, limit, updateDoc } from 'firebase/firestore';
import { app } from '~/firebase/firebaseConfig';

const db = getFirestore(app);

// Function to get notifications by userId, sorted by creation date
export const getNotificationsByUserId = async (userId: string) => {
  try {
    if (!userId) {
      console.log('User ID is not provided.');
      return [];
    }

    // Step 1: Get the list of devices associated with the user
    const devicesRef = collection(db, 'users', userId, 'devices');
    const devicesSnapshot = await getDocs(devicesRef);

    if (devicesSnapshot.empty) {
      console.log('No devices found for this user.');
      return [];
    }

    // Step 2: Fetch notifications for each device
    const allNotifications: any[] = [];

    // Loop through each device to get notifications
    for (const deviceDoc of devicesSnapshot.docs) {
      const device_id = deviceDoc.id;

      // Query notifications for this device
      const notificationsRef = collection(db, 'users', userId, 'devices', device_id, 'notifications');
      const notificationsQuery = query(
        notificationsRef,
        orderBy('created_at', 'desc') // Sort by creation date (newest first)
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);

      // Push notifications into the array
      notificationsSnapshot.docs.forEach(doc => {
        allNotifications.push({
          id: doc.id,
          created_at: doc.data().created_at,
          is_read: doc.data().is_read
        });
      });
    }

    // Step 3: Sort all notifications by created_at globally
    allNotifications.sort((a, b) => b.created_at.seconds - a.created_at.seconds); // Sort by date descending
    return allNotifications;
  } catch (error) {
    console.error('Error fetching notifications or devices:', error);
    throw error;
  }
};

// Function to get notification details by notification ID
export const getNotificationDetailById = async (userId: string, notificationId: string) => {
  try {
    if (!userId || !notificationId) {
      console.log('User ID or Notification ID is not provided.');
      return null;
    }

    // Step 1: Get the list of devices associated with the user
    const devicesRef = collection(db, 'users', userId, 'devices');
    const devicesSnapshot = await getDocs(devicesRef);

    if (devicesSnapshot.empty) {
      console.log('No devices found for this user.');
      return null;
    }

    // Step 2: Loop through each device to find the notification by its ID
    for (const deviceDoc of devicesSnapshot.docs) {
      const device_id = deviceDoc.id;

      // Get the notification document by its ID
      const notificationRef = doc(db, 'users', userId, 'devices', device_id, 'notifications', notificationId);
      const notificationDoc = await getDoc(notificationRef);

      if (notificationDoc.exists()) {
        // Step 3: Fetch the device `installed_at` field
        const deviceData = deviceDoc.data();

        // Return the notification data along with device's `installed_at`
        const notificationData = notificationDoc.data();
        return {
          id: notificationDoc.id,
          ...notificationData,
          created_at: notificationData.created_at.toDate(),
          device: {
            name: deviceData.name,
            installed_at: deviceData.installed_at,
          },
        };
      }
    }

    console.log('Notification not found.');
    return null;
  } catch (error) {
    console.error('Error fetching notification detail:', error);
    throw error;
  }
};

export const getLatestNotificationsByUserId = async (userId: string) => {
  try {
    if (!userId) {
      console.log('User ID is not provided.');
      return [];
    }

    // Step 1: Get the list of devices associated with the user
    const devicesRef = collection(db, 'users', userId, 'devices');
    const devicesSnapshot = await getDocs(devicesRef);

    if (devicesSnapshot.empty) {
      console.log('No devices found for this user.');
      return [];
    }

    // Step 2: Fetch notifications for each device (limit to the latest 3 per device)
    const allNotifications: any[] = [];

    for (const deviceDoc of devicesSnapshot.docs) {
      const device_id = deviceDoc.id;

      // Query notifications for this device, limiting to the latest 3
      const notificationsRef = collection(db, 'users', userId, 'devices', device_id, 'notifications');
      const notificationsQuery = query(
        notificationsRef,
        orderBy('created_at', 'desc'),
        limit(3)
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);

      // Push notifications into the array
      notificationsSnapshot.docs.forEach(doc => {
        allNotifications.push({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at.toDate(), // Convert to JavaScript Date
        });
      });
    }

    // Step 3: Sort all notifications globally by created_at and get the top 3
    const latestNotifications = allNotifications
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 3);

    return latestNotifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const setReadNotification = async (userId: string, notificationId: string, is_read : boolean) => {
  try {
    if (!userId || !notificationId) {
      console.log('User ID or Notification ID is not provided.');
      return null;
    }

    // Step 1: Get the list of devices associated with the user
    const devicesRef = collection(db, 'users', userId, 'devices');
    const devicesSnapshot = await getDocs(devicesRef);

    if (devicesSnapshot.empty) {
      console.log('No devices found for this user.');
      return null;
    }

    // Step 2: Loop through each device to find the notification by its ID
    for (const deviceDoc of devicesSnapshot.docs) {
      const device_id = deviceDoc.id;

      // Get the notification document by its ID
      const notificationRef = doc(db, 'users', userId, 'devices', device_id, 'notifications', notificationId);
      const notificationDoc = await getDoc(notificationRef);

      if (notificationDoc.exists()) {
        const result = await updateDoc(notificationRef, 'is_read', is_read)
        return;
      }
    }

    console.log('Notification not found.');
    return null;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};