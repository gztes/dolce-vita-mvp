import { Text } from 'react-native';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';

type PlanCardProps = {
  lines: string[];
  shouldPulse?: boolean;
};

export default function PlanCard({ lines, shouldPulse }: PlanCardProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.97);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    // Initial fade-in and scale animation
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withTiming(1, { duration: 200 });
  }, []);

  useEffect(() => {
    // Pulse animation when shouldPulse changes
    if (shouldPulse) {
      pulseOpacity.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [shouldPulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * pulseOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      style={[animatedStyle, { marginTop: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16 }]}
    >
      {lines.map((line, index) => (
        <Text
          key={index}
          className={`text-sm leading-6 ${
            line.startsWith('Auto-deferred')
              ? 'text-gray-500 italic mt-2'
              : 'text-gray-900'
          }`}
        >
          {line}
        </Text>
      ))}
    </Animated.View>
  );
}
