import { View, Text } from 'react-native';

type ChatMessageProps = {
  role: 'system' | 'user';
  text: string;
};

export default function ChatMessage({ role, text }: ChatMessageProps) {
  return (
    <View
      className={`mb-3 ${
        role === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          role === 'system'
            ? 'bg-blue-100'
            : 'bg-gray-200'
        }`}
      >
        <Text className="text-base text-gray-900">
          {text}
        </Text>
      </View>
    </View>
  );
}
