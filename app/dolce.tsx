import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

type Message = {
  role: 'system' | 'user';
  text: string;
};

export default function DolceScreen() {
  const [messages] = useState<Message[]>([
    { role: 'system', text: 'Hey, want me to plan your day?' },
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Messages Area */}
      <ScrollView 
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            className={`mb-3 ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === 'system'
                  ? 'bg-blue-100'
                  : 'bg-gray-200'
              }`}
            >
              <Text className="text-base text-gray-900">
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="px-4 pb-6 pt-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-black py-4 rounded-xl items-center"
          onPress={() => {
            // TODO: Handle button press
            console.log('Plan My Day pressed');
          }}
        >
          <Text className="text-white text-lg font-semibold">
            Yes — Plan My Day
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
