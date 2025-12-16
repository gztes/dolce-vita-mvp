import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

type Message = {
  role: 'system' | 'user';
  text: string;
};

const fakePlan = [
  '08:10–08:30 → Quick Wins: Email client, Clean up inbox',
  '08:30–09:00 → Review designs',
  '09:00–10:00 → Meeting',
  '10:00–11:00 → Deep Work: Finish monthly report',
  '12:30–13:30 → Lunch',
  '15:00–16:00 → Call',
  '16:00–16:30 → Overflow / admin',
  'Auto-deferred to Tomorrow: Research new AI tools, Check team feedback',
];

export default function DolceScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: 'Hey, want me to plan your day?' },
  ]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [planLines, setPlanLines] = useState<string[]>([]);

  const handlePlanMyDay = () => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Yes — Plan My Day' },
    ]);

    // After 500ms, generate plan
    setTimeout(() => {
      setPlanLines(fakePlan);
      setPlanGenerated(true);
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: "Here's your plan:" },
      ]);
    }, 500);
  };

  const handleAction = (actionLabel: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: actionLabel },
    ]);

    // After 500ms, add system response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Done. Your day has been reflowed.' },
      ]);
    }, 500);
  };

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

        {/* Plan Card */}
        {planGenerated && (
          <View className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            {planLines.map((line, index) => (
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
        )}

        {/* Action Buttons */}
        {planGenerated && (
          <View className="mt-4 flex-row flex-wrap gap-2">
            <TouchableOpacity
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg"
              onPress={() => handleAction('Skip a Task')}
            >
              <Text className="text-gray-900 text-sm font-medium">
                Skip a Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg"
              onPress={() => handleAction('Add Something')}
            >
              <Text className="text-gray-900 text-sm font-medium">
                Add Something
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg"
              onPress={() => handleAction('Move Something')}
            >
              <Text className="text-gray-900 text-sm font-medium">
                Move Something
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg"
              onPress={() => handleAction('Replan My Day')}
            >
              <Text className="text-gray-900 text-sm font-medium">
                Replan My Day
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      <View className="px-4 pb-6 pt-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-black py-4 rounded-xl items-center"
          onPress={handlePlanMyDay}
          disabled={planGenerated}
        >
          <Text className="text-white text-lg font-semibold">
            {planGenerated ? 'Plan Generated' : 'Yes — Plan My Day'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
