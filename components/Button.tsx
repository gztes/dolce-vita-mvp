import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';

type ButtonProps = PressableProps & {
  title: string;
};

export function Button({ title, ...props }: ButtonProps) {
  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
