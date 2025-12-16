import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModalProvider, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import ChatMessage from '@/components/ChatMessage';
import PlanCard from '@/components/PlanCard';
import PrimaryButton from '@/components/PrimaryButton';

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

const fakeCalendar = [
  '09:00–10:00 Meeting',
  '12:30–13:30 Lunch',
  '15:00–16:00 Call',
];

const fakeTasks = [
  'Finish monthly report',
  'Email client',
  'Review designs',
  'Clean up inbox',
  'Write 3 ideas for blog',
];

function DolceScreenContent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', text: 'Hey, want me to plan your day?' },
  ]);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [planLines, setPlanLines] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [showRealInputs, setShowRealInputs] = useState(false);
  const [calendarText, setCalendarText] = useState('');
  const [tasksText, setTasksText] = useState('');
  const [shouldPulse, setShouldPulse] = useState(false);
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePlanMyDay = () => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Yes — Plan My Day' },
    ]);

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
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: actionLabel },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Done. Your day has been reflowed.' },
      ]);
      // Trigger pulse animation
      setShouldPulse(true);
      setTimeout(() => setShouldPulse(false), 300);
    }, 500);
  };

  const handleSubmitInput = () => {
    if (input.trim()) {
      console.log('Input submitted:', input);
      setInput('');
    }
  };

  const handleUseRealPlan = () => {
    setMessages((prev) => [
      ...prev,
      { role: 'system', text: 'Thanks. Generating your real plan now...' },
    ]);

    setTimeout(() => {
      const stubPlan = [
        `(stub) Your calendar: ${calendarText}`,
        ...tasksText.split('\n').filter(line => line.trim()).map(task => `- ${task}`),
      ];
      setPlanLines(stubPlan);
      setShowRealInputs(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top-right pill button */}
      <View className="absolute top-12 right-4 z-10">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-full"
          onPress={() => bottomSheetRef.current?.present()}
        >
          <Text className="text-white text-sm font-medium">
            Today's Context
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <ScrollView 
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            text={message.text}
          />
        ))}

        {/* Plan Card */}
        {planGenerated && <PlanCard lines={planLines} shouldPulse={shouldPulse} />}

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

      {/* Bottom Area */}
      <View className="px-4 pb-6 pt-4 border-t border-gray-200">
        {/* Real Inputs Section */}
        {planGenerated && showRealInputs && (
          <View className="mb-4">
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base text-gray-900 mb-3"
              placeholder="Paste today's calendar (e.g. 09:00–10:00 Team call)"
              placeholderTextColor="#9CA3AF"
              value={calendarText}
              onChangeText={setCalendarText}
              multiline
              numberOfLines={3}
            />
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-xl text-base text-gray-900 mb-3"
              placeholder="Paste your tasks (one per line)"
              placeholderTextColor="#9CA3AF"
              value={tasksText}
              onChangeText={setTasksText}
              multiline
              numberOfLines={4}
            />
            <PrimaryButton
              label="Use My Real Plan"
              onPress={handleUseRealPlan}
            />
          </View>
        )}

        {/* Try Real Calendar Button */}
        {planGenerated && !showRealInputs && (
          <TouchableOpacity
            className="bg-white border border-gray-300 py-3 rounded-xl items-center mb-3"
            onPress={() => setShowRealInputs(true)}
          >
            <Text className="text-gray-900 text-base font-medium">
              Try with my real calendar & tasks
            </Text>
          </TouchableOpacity>
        )}

        {/* Main Bottom Action */}
        {!planGenerated ? (
          <PrimaryButton
            label="Yes — Plan My Day"
            onPress={handlePlanMyDay}
          />
        ) : !showRealInputs ? (
          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-xl text-base text-gray-900"
            placeholder="Try /add task Email Marie or /skip Q4 report"
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmitInput}
            returnKeyType="send"
          />
        ) : null}
      </View>

      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['50%']}
        enablePanDownToClose
      >
        <BottomSheetView className="flex-1 px-6 py-4">
          <ScrollView>
            {/* Calendar Section */}
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Calendar
            </Text>
            {fakeCalendar.map((event, index) => (
              <Text key={index} className="text-base text-gray-700 mb-2">
                {event}
              </Text>
            ))}

            {/* Tasks Section */}
            <Text className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Tasks
            </Text>
            {fakeTasks.map((task, index) => (
              <Text key={index} className="text-base text-gray-700 mb-2">
                • {task}
              </Text>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

export default function DolceScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <DolceScreenContent />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
