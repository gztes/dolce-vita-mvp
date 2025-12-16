import { View, Text, StyleSheet } from 'react-native';

type ChatMessageProps = {
  role: 'system' | 'user';
  text: string;
};

export default function ChatMessage({ role, text }: ChatMessageProps) {
  return (
    <View style={[styles.container, role === 'user' ? styles.userContainer : styles.systemContainer]}>
      <View style={[styles.bubble, role === 'system' ? styles.systemBubble : styles.userBubble]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  systemContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  systemBubble: {
    backgroundColor: '#DBEAFE', // blue-100
  },
  userBubble: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  text: {
    fontSize: 16,
    color: '#111827', // gray-900
  },
});
