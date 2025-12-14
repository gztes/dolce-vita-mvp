import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/lib/AuthContext';
import * as api from '@/lib/api';

const RATING_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Not great' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Excellent' },
];

export default function ReflectionScreen() {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      api.getTodayPlan(user.id).then((plan) => {
        if (plan) setPlanId(plan.id);
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || rating === null) return;

    setLoading(true);
    try {
      await api.createReflection(user.id, planId, rating, notes || undefined);
      router.replace('/today');
    } catch (error) {
      console.error('Error creating reflection:', error);
      alert('Failed to save reflection');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = rating !== null && !loading;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How did today go?</Text>
      <Text style={styles.subtitle}>Quick reflection to learn and improve</Text>

      {/* Rating */}
      <View style={styles.section}>
        <Text style={styles.label}>Overall rating</Text>
        <View style={styles.ratingGrid}>
          {RATING_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.ratingOption,
                rating === option.value && styles.ratingOptionSelected,
              ]}
              onPress={() => setRating(option.value)}
            >
              <Text style={styles.ratingEmoji}>{option.emoji}</Text>
              <Text style={styles.ratingLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Optional Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>What happened? (optional)</Text>
        <TextInput
          style={styles.textInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="What worked? What didn't? What did you learn?"
          placeholderTextColor="#666"
          multiline
          numberOfLines={5}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Done for today'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace('/today')}
      >
        <Text style={styles.skipButtonText}>Skip for now</Text>
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
  ratingGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingOption: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingEmoji: {
    fontSize: 32,
  },
  ratingLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
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
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
