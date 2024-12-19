import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '~/firebase/firebaseConfig';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

// Interface for the response data
interface ResponseData<T = any> {
  has_error: boolean;
  payload: T | null;
  error: string;
}

// Interface for the user signup data
export interface UserSignupData {
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

// Signup service
export const signUpService = async ({ email, password }: UserSignupData): Promise<ResponseData<string>> => {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed up successfully:", user.uid);

    return {
      has_error: false,
      payload: `User signed up successfully: ${user.uid}`,
      error: "",
    };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { code: string; message: string };
    console.error(`Error signing up: ${firebaseError.code} - ${firebaseError.message}`);

    return {
      has_error: true,
      payload: null,
      error: `Error signing up: ${firebaseError.code} - ${firebaseError.message}`,
    };
  }
};

// Sign-in service
export const signInService = async ({ email, password }: UserLoginData): Promise<ResponseData<string>> => {
  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      has_error: false,
      payload: `User signed in successfully: ${user.uid}`,
      error: "",
    };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { code: string; message: string };
    console.error(`Error signing in: ${firebaseError.code} - ${firebaseError.message}`);

    return {
      has_error: true,
      payload: null,
      error: `Error signing in: ${firebaseError.code} - ${firebaseError.message}`,
    };
  }
};

// Logout service
export const logoutService = async (): Promise<ResponseData<string>> => {
  try {
    await auth.signOut();

    return {
      has_error: false,
      payload: "User signed out successfully.",
      error: "",
    };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { message: string };
    console.error(`Error signing out: ${firebaseError.message}`);

    return {
      has_error: true,
      payload: null,
      error: `Error signing out: ${firebaseError.message}`,
    };
  }
};

export const getReadKey = async (userId: string): Promise<ResponseData<string>> => {
  try {
    const userDocRef = doc(db, "users", userId); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const readKey = data?.read_key;

      if (readKey) {
        return {
          has_error: false,
          payload: readKey,
          error: "",
        };
      } else {
        return {
          has_error: true,
          payload: null,
          error: "Read key not found for this user.",
        };
      }
    } else {
      return {
        has_error: true,
        payload: null,
        error: "User not found in Firestore.",
      };
    }
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { message: string };
    console.error(`Error fetching read key: ${firebaseError.message}`);

    return {
      has_error: true,
      payload: null,
      error: `Error fetching read key: ${firebaseError.message}`,
    };
  }
};

export const getWriteKey = async (userId: string): Promise<ResponseData<string>> => {
  try {
    const userDocRef = doc(db, "users", userId); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const writeKey = data?.write_key;

      if (writeKey) {
        return {
          has_error: false,
          payload: writeKey,
          error: "",
        };
      } else {
        return {
          has_error: true,
          payload: null,
          error: "Read key not found for this user.",
        };
      }
    } else {
      return {
        has_error: true,
        payload: null,
        error: "User not found in Firestore.",
      };
    }
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { message: string };
    console.error(`Error fetching read key: ${firebaseError.message}`);

    return {
      has_error: true,
      payload: null,
      error: `Error fetching read key: ${firebaseError.message}`,
    };
  }
};