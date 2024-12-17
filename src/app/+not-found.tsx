import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

export default function NotFoundScreen() {
  const router = useRouter();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedStyles]}>
        <Text style={styles.icon}>404</Text>
      </Animated.View>
      <Text style={styles.title}>Oops! Page Not Found</Text>
      <Text style={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Button
        onPress={() => router.replace('/')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});