import { app } from "~/firebase/firebaseConfig";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app);

// Interface for the response data
interface ResponseData<T = any> {
  has_error: boolean;
  payload: T | null;
  error: string | null;
}

const getListDeviceByUserId = async (userId: string): Promise<ResponseData<any[]>> => {
  try {
    if (!userId) {
      return {
        has_error: true,
        payload: null,
        error: "Missing userId parameter",
      };
    }

    const devicesRef = collection(db, "users", userId, "devices");
    const devicesSnapshot = await getDocs(devicesRef);

    if (devicesSnapshot.empty) {
      return {
        has_error: false,
        payload: [],
        error: null,
      };
    }

    // Extract devices data
    const devices = devicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      installed_at: doc.data().installed_at,
      device_name: doc.data().name,
    }));

    return {
      has_error: false,
      payload: devices,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching devices:", error);
    return {
      has_error: true,
      payload: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export { getListDeviceByUserId  };