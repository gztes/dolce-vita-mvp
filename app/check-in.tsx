import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/lib/AuthContext';
import * as api from '@/lib/api';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Awful' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

const ENERGY_OPTIONS = [
  { value: 1, emoji: '🪫', label: 'Drained' },
  { value: 2, emoji: '🔋', label: 'Low' },
  { value: 3, emoji: '🔋', label: 'Medium' },
  { value: 4, emoji: '⚡', label: 'High' },
  { value: 5, emoji: '⚡', label: 'Energized' },
];

export default function CheckInScreen() {
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || mood === null || energy === null) return;

    setLoading(true);
    try {
      const checkIn = await api.createCheckIn(user.id, mood, energy, note || undefined);
      
      // Generate plan (for now, empty calendar events)
      const plan = api.generatePlan(checkIn, [], '09:00', '17:00');
      await api.createDayPlan(user.id, checkIn.id, plan);

      router.replace('/today');
    } catch (error) {
      console.error('Error creating check-in:', error);
      alert('Failed to create check-in');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = mood !== null && energy !== null && !loading;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How are you today?</Text>
      <Text style={styles.subtitle}>Quick check-in to plan your day</Text>

      {/* Mood */}
      <View style={styles.section}>
        <Text style={styles.label}>Mood</Text>
        <View style={styles.optionsGrid}>
          {MOOD_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                mood === option.value && styles.optionSelected,
              ]}
              onPress={() => setMood(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Energy */}
      <View style={styles.section}>
        <Text style={styles.label}>Energy</Text>
        <View style={styles.optionsGrid}>
          {ENERGY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                energy === option.value && styles.optionSelected,
              ]}
              onPress={() => setEnergy(option.value)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Optional Note */}
      <View style={styles.section}>
        <Text style={styles.label}>Anything else? (optional)</Text>
        <TextInput
          style={styles.textInput}
          value={note}
          onChangeText={setNote}
          placeholder="e.g., Didn't sleep well, big meeting today..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating your plan...' : 'See my plan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: -20,
  },
  section: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionEmoji: {
    fontSize: 32,
  },
  optionLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
