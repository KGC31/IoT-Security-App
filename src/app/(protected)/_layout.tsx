import "~/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DarkTheme,
    DefaultTheme,
    Theme,
    ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useAuth } from "~/hooks/useAuth";
import { useRouter } from "expo-router";
import { Bell, LogOut } from "lucide-react-native";
import AlertButton from "~/components/SecurityWarning";
import { MenuDropdownComponent } from "~/components/MenuDropdown";
import { logoutService } from "~/services/authServices";

// Define light and dark themes for navigation
const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router"; // Export error boundary for better error handling

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme(); // Custom hook for color scheme management
    const { user, loading } = useAuth(); // Auth hook to manage user state
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false); // Track if the color scheme has been loaded
    const router = useRouter();

    // Manage theme from AsyncStorage and platform-specific settings
    React.useEffect(() => {
        (async () => {
            const theme = await AsyncStorage.getItem("theme");

            // Add a class to the HTML element for consistent background on web
            if (Platform.OS === "web") {
                document.documentElement.classList.add("bg-background");
            }

            // If no theme is stored, save the current color scheme and exit
            if (!theme) {
                await AsyncStorage.setItem("theme", colorScheme);
                setIsColorSchemeLoaded(true);
                return;
            }

            // Ensure the stored theme matches the current color scheme
            const colorTheme = theme === "dark" ? "dark" : "light";
            if (colorTheme !== colorScheme) {
                setColorScheme(colorTheme);
            }

            // Apply theme to the Android navigation bar (if applicable)
            setAndroidNavigationBar(colorTheme);
            setIsColorSchemeLoaded(true);
        })().finally(() => {
            SplashScreen.hideAsync(); // Hide the splash screen once loading is done
        });
    }, []);

    // Redirect to sign-in if user is not authenticated
    React.useEffect(() => {
        if (!loading && !user) {
            router.replace("/sign-in");
        }
    }, [user, loading, router]);


    const handleLogout = async () => {
        try {
            const response = await logoutService();
            if (!response.has_error) {
                console.log('User logged out successfully');
                router.replace('/sign-in'); // Redirect to sign-in page
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error('Unexpected error during logout:', error);
        }
    };

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

            <Stack
                screenOptions={{
                    headerLeft: undefined
                }}
            >
                {/* Home Screen */}
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerLeft: undefined,
                        headerRight: () => (
                            <View className="flex flex-row justify-between items-center">
                                {/* Notifications Button */}
                                <TouchableOpacity
                                    onPress={() => router.push("/notifications")}
                                    style={{ marginRight: 16 }}
                                >
                                    <Bell
                                        size={23}
                                        strokeWidth={1.25}
                                        color={'#000'}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleLogout}>
                                    <LogOut 
                                        size={20} 
                                        strokeWidth={1.25}
                                        color={'#000'}
                                    />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />

                {/* Notifications List */}
                <Stack.Screen
                    name="notifications/index"
                    options={{
                        title: "Notifications",
                    }}
                />

                {/* Notifications List */}
                <Stack.Screen
                    name="notifications/[id]"
                    options={{
                        title: "Notification",
                    }}
                />
            </Stack>

            {/* PortalHost for managing modals, toasts, or popups */}
            <PortalHost />

            {/* Custom AlertButton for additional functionality */}
            <AlertButton />
        </ThemeProvider>
    );
}