import { View, Text } from 'react-native';

type PlanCardProps = {
  lines: string[];
};

export default function PlanCard({ lines }: PlanCardProps) {
  return (
    <View className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
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
    </View>
  );
}
