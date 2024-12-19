import "~/global.css";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Hide the splash screen after determining the authentication state
      // SplashScreen.hideAsync();

      if (user) {
        // Redirect authenticated users to the home route
        router.replace("/(protected)");
      }
    }
  }, [loading, user, router]);

  // While loading the authentication state, show the splash screen
  if (loading) {
    return null; // Keeps the splash screen visible
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Conditionally render screens based on authentication status */}
      {!user ? (
        <>
          {/* Unauthenticated User Screens */}
          <Stack.Screen
            name="(auth)/sign-in"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(auth)/sign-up"
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : null}
    </Stack>
  );
}
