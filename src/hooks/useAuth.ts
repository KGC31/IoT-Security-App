import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "~/firebase/firebaseConfig"; // adjust path as necessary

// Define hook return types for better type safety
interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isValidToken: boolean;
  error: string | null;
}

// Define the useAuth hook
export function useAuth(): AuthContextProps {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);

    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get the access token for the current authenticated user
          const token = await currentUser.getIdToken();
          setAccessToken(token);

          // Get token details and expiration time
          const tokenResult = await currentUser.getIdTokenResult();
          const tokenExpirationTimestamp = new Date(tokenResult.expirationTime).getTime();
          const currentTime = Date.now();

          setIsValidToken(currentTime < tokenExpirationTimestamp);
          setUser(currentUser);
        } catch (err: any) {
          setError(err.message || "Failed to get the access token");
        }
      } else {
        // No user is signed in
        setUser(null);
        setAccessToken(null);
        setIsValidToken(false);
      }
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return { user, accessToken, loading, isValidToken, error };
}