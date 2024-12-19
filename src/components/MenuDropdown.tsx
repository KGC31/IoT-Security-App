
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut } from "lucide-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Menu } from 'lucide-react-native';
import { logoutService } from '~/services/authServices';
import { TouchableOpacity } from 'react-native';

export function MenuDropdownComponent() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      const response = await logoutService();
      if (!response.has_error) {
        console.log('User logged out successfully');
        router.replace('/sign-in');
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity className='bg-background'>
          <Menu
            size={23}
            strokeWidth={1.25}
            color={'#000'}
          />
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64 native:w-72'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={toggleTheme}>
          {isDarkColorScheme ? (
            <Moon size={20} className="mr-2 text-foreground" />
          ) : (
            <Sun size={20} className="mr-2 text-foreground" />
          )}
          <Text>{isDarkColorScheme ? 'Dark Mode' : 'Light Mode'}</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={handleLogout}>
          <LogOut size={20} className="mr-2 text-primary" />
          <Text>Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
