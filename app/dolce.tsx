import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
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
    <SafeAreaView style={styles.container}>
      {/* Top-right pill button */}
      <View style={styles.contextButtonContainer}>
        <TouchableOpacity
          style={styles.contextButton}
          onPress={() => bottomSheetRef.current?.present()}
        >
          <Text style={styles.contextButtonText}>Today's Context</Text>
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAction('Skip a Task')}
            >
              <Text style={styles.actionButtonText}>Skip a Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAction('Add Something')}
            >
              <Text style={styles.actionButtonText}>Add Something</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAction('Move Something')}
            >
              <Text style={styles.actionButtonText}>Move Something</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAction('Replan My Day')}
            >
              <Text style={styles.actionButtonText}>Replan My Day</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Area */}
      <View style={styles.bottomArea}>
        {/* Real Inputs Section */}
        {planGenerated && showRealInputs && (
          <View style={styles.realInputsSection}>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Paste today's calendar (e.g. 09:00–10:00 Team call)"
              placeholderTextColor="#9CA3AF"
              value={calendarText}
              onChangeText={setCalendarText}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={[styles.input, styles.multilineInput, styles.inputSpacing]}
              placeholder="Paste your tasks (one per line)"
              placeholderTextColor="#9CA3AF"
              value={tasksText}
              onChangeText={setTasksText}
              multiline
              numberOfLines={4}
            />
            <View style={styles.inputSpacing}>
              <PrimaryButton
                label="Use My Real Plan"
                onPress={handleUseRealPlan}
              />
            </View>
          </View>
        )}

        {/* Try Real Calendar Button */}
        {planGenerated && !showRealInputs && (
          <TouchableOpacity
            style={styles.tryRealButton}
            onPress={() => setShowRealInputs(true)}
          >
            <Text style={styles.tryRealButtonText}>
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
            style={styles.input}
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
        <BottomSheetView style={styles.bottomSheet}>
          <ScrollView>
            <Text style={styles.sheetTitle}>Calendar</Text>
            {fakeCalendar.map((event, index) => (
              <Text key={index} style={styles.sheetItem}>{event}</Text>
            ))}

            <Text style={[styles.sheetTitle, styles.sheetTitleSpacing]}>Tasks</Text>
            {fakeTasks.map((task, index) => (
              <Text key={index} style={styles.sheetItem}>• {task}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contextButtonContainer: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,
  },
  contextButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  contextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  actionButtons: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  realInputsSection: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputSpacing: {
    marginTop: 12,
  },
  tryRealButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  tryRealButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSheet: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  sheetTitleSpacing: {
    marginTop: 24,
  },
  sheetItem: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
});
