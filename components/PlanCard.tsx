import { Text, StyleSheet } from 'react-native';
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
    <Animated.View style={[styles.card, animatedStyle]}>
      {lines.map((line, index) => (
        <Text
          key={index}
          style={[
            styles.line,
            line.startsWith('Auto-deferred') && styles.deferredLine
          ]}
        >
          {line}
        </Text>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 16,
    padding: 16,
  },
  line: {
    fontSize: 14,
    lineHeight: 24,
    color: '#111827', // gray-900
  },
  deferredLine: {
    color: '#6B7280', // gray-500
    fontStyle: 'italic',
    marginTop: 8,
  },
});
