import { View, Text, SafeAreaView } from 'react-native';

export default function DolceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">
          Dolce Vita MVP
        </Text>
      </View>
    </SafeAreaView>
  );
}
