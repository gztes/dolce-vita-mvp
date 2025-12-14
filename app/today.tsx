import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/lib/AuthContext';
import * as api from '@/lib/api';
import type { DayPlan, PlanBlock } from '@/lib/types';

export default function TodayScreen() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [nextStep, setNextStep] = useState<PlanBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlan = async () => {
    if (!user) return;

    try {
      const todayPlan = await api.getTodayPlan(user.id);
      setPlan(todayPlan);
      
      if (todayPlan) {
        const next = api.getNextStep(todayPlan);
        setNextStep(next);
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlan();
  };

  const handleCompleteStep = async () => {
    if (!plan || nextStep === null) return;

    const currentIndex = plan.plan.indexOf(nextStep);
    if (currentIndex === -1) return;

    try {
      await api.updateCurrentStep(plan.id, currentIndex + 1);
      await loadPlan();
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  const handleReflect = () => {
    router.push('/reflection');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your plan...</Text>
        </View>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No plan yet</Text>
          <Text style={styles.emptySubtitle}>Start with a check-in</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/check-in')}
          >
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const completedCount = plan.current_step;
  const totalCount = plan.plan.length;
  const allDone = completedCount >= totalCount;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressText}>
          {completedCount} of {totalCount} blocks completed
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Next Step Card */}
      {!allDone && nextStep ? (
        <View style={styles.nextStepCard}>
          <Text style={styles.nextStepLabel}>NEXT UP</Text>
          <Text style={styles.nextStepTitle}>{nextStep.title}</Text>
          <View style={styles.nextStepMeta}>
            <Text style={styles.nextStepTime}>
              {nextStep.start} - {nextStep.end}
            </Text>
            <Text style={styles.nextStepDuration}>{nextStep.duration} min</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleCompleteStep}>
            <Text style={styles.startButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.doneCard}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>All done for today!</Text>
          <Text style={styles.doneSubtitle}>How did it go?</Text>
          <TouchableOpacity style={styles.reflectButton} onPress={handleReflect}>
            <Text style={styles.reflectButtonText}>Reflect on Today</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Full Plan */}
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Your Plan</Text>
        {plan.plan.map((block, index) => {
          const isCompleted = index < completedCount;
          const isCurrent = index === completedCount;

          return (
            <View
              key={index}
              style={[
                styles.blockItem,
                isCompleted && styles.blockCompleted,
                isCurrent && styles.blockCurrent,
              ]}
            >
              <View style={[styles.blockIndicator, { backgroundColor: getBlockColor(block.type) }]} />
              <View style={styles.blockContent}>
                <Text style={[styles.blockTitle, isCompleted && styles.blockTitleCompleted]}>
                  {block.title}
                </Text>
                <Text style={styles.blockTime}>
                  {block.start} - {block.end} ({block.duration}m)
                </Text>
              </View>
              {isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function getBlockColor(type: string): string {
  switch (type) {
    case 'event':
      return '#FF3B30';
    case 'focus':
      return '#007AFF';
    case 'break':
      return '#34C759';
    default:
      return '#999';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  progressCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  nextStepCard: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  nextStepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    opacity: 0.8,
    letterSpacing: 1,
  },
  nextStepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextStepMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  nextStepTime: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  nextStepDuration: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  doneCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  doneEmoji: {
    fontSize: 48,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  doneSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  reflectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  reflectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
  },
  blockCompleted: {
    opacity: 0.5,
  },
  blockCurrent: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  blockIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  blockContent: {
    flex: 1,
    gap: 4,
  },
  blockTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  blockTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  blockTime: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 20,
    color: '#34C759',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
