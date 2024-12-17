import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { app } from '~/firebase/firebaseConfig';

// Interface for the user signup data
export interface UserSignupData {
  email: string;
  password: string;
}

// Interface for the signup response
export interface SignupResponse {
  success: boolean;
  user?: User; // Firebase User object
  errorMessage?: string; // Error message, if any
}

// Signup service
export const signUpService = async ({ email, password }: UserSignupData): Promise<SignupResponse> => {
  const auth = getAuth(app);

  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed up successfully:", user.uid);

    return {
      success: true,
      user,
    };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { code: string; message: string };
    console.error(`Error signing up: ${firebaseError.code} - ${firebaseError.message}`);

    return {
      success: false,
      errorMessage: `Error signing up: ${firebaseError.code} - ${firebaseError.message}`,
    };
  }
};

// Interface for the user login data
export interface UserLoginData {
  email: string;
  password: string;
}

// Interface for the sign-in response
export interface SignInResponse {
  success: boolean;
  user?: User; // Firebase User object
  token?: string; // ID token
  errorMessage?: string; // Error message, if any
}

// Sign-in service
export const signInService = async ({ email, password }: UserLoginData): Promise<SignInResponse> => {
  const auth = getAuth(app);

  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the ID token for the authenticated user
    const token = await user.getIdToken();

    return {
      success: true,
      user,
      token,
    };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { code: string; message: string };
    console.error(`Error signing in: ${firebaseError.code} - ${firebaseError.message}`);

    return {
      success: false,
      errorMessage: `Error signing in: ${firebaseError.code} - ${firebaseError.message}`,
    };
  }
};

// Interface for the logout response
export interface LogoutResponse {
  success: boolean;
  errorMessage?: string; // Error message, if any
}

// Logout service
export const logoutService = async (): Promise<LogoutResponse> => {
  const auth = getAuth(app);

  try {
    // Sign out the authenticated user
    await signOut(auth);
    console.log("User signed out successfully.");
    return { success: true };
  } catch (error: unknown) {
    // Safely handle errors
    const firebaseError = error as { message: string };
    console.error(`Error signing out: ${firebaseError.message}`);
    return {
      success: false,
      errorMessage: `Error signing out: ${firebaseError.message}`,
    };
  }
};