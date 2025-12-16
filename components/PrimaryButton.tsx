import { TouchableOpacity, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className="bg-black py-4 rounded-xl items-center"
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white text-lg font-semibold">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
