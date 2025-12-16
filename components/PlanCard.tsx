import { View, Text, StyleSheet } from 'react-native';

type PlanCardProps = {
  lines: string[];
  shouldPulse?: boolean;
};

export default function PlanCard({ lines }: PlanCardProps) {
  return (
    <View style={styles.card}>
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
    </View>
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
