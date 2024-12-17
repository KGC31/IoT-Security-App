import "~/global.css";
import { SplashScreen, Stack } from "expo-router";
export { ErrorBoundary } from "expo-router"; // Export error boundary for better error handling

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Sign-In Screen */}
      <Stack.Screen
        name="(auth)/sign-in"
        options={{
          headerShown: false,
        }}
      />

      {/* Sign-Up Screen */}
      <Stack.Screen
        name="(auth)/sign-up"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
