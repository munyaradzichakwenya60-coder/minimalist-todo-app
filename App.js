import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const INITIAL_TODOS = [
  {
    id: '1',
    title: 'Complete African Unicorn assessment & review code',
    category: 'Work',
    priority: 'High',
    completed: true,
    createdAt: '9:30 AM',
  },
  {
    id: '2',
    title: 'Test TakeOFF driver onboarding flow on Android',
    category: 'Work',
    priority: 'High',
    completed: true,
    createdAt: '10:15 AM',
  },
  {
    id: '3',
    title: 'Build lightweight Expo React Native To-Do application',
    category: 'Study',
    priority: 'Medium',
    completed: false,
    createdAt: '11:20 AM',
  },
  {
    id: '4',
    title: 'Review weekly development goals and git commits',
    category: 'Personal',
    priority: 'Low',
    completed: false,
    createdAt: '11:30 AM',
  },
];

export default function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [inputTitle, setInputTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleAddTodo = () => {
    if (!inputTitle.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      completed: false,
      createdAt: 'Just now',
    };

    setTodos([newTodo, ...todos]);
    setInputTitle('');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const filteredTodos = todos.filter((item) => {
    if (activeFilter === 'Active') return !item.completed;
    if (activeFilter === 'Completed') return item.completed;
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.contentWrapper}>
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={styles.dateSubtitle}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.headerTitle}>Tasks</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {completedCount} of {totalCount} completed
              </Text>
            </View>
          </View>

          {/* Minimalist Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>Daily Progress</Text>
              <Text style={styles.progressNumber}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {['All', 'Active', 'Completed'].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveFilter(tab)}
                  style={[styles.filterTab, isActive && styles.filterTabActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Todo List */}
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No tasks found</Text>
                <Text style={styles.emptySubtitle}>
                  {activeFilter === 'Completed'
                    ? 'No tasks completed yet.'
                    : 'Add a new task below.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.todoCard, item.completed && styles.todoCardCompleted]}>
                <TouchableOpacity
                  onPress={() => handleToggleTodo(item.id)}
                  style={styles.checkboxContainer}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.completed && styles.checkboxChecked,
                    ]}
                  >
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <View style={styles.todoBody}>
                  <Text
                    style={[
                      styles.todoTitle,
                      item.completed && styles.todoTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{item.category}</Text>
                    </View>

                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>{item.priority}</Text>
                    </View>

                    <Text style={styles.timeText}>{item.createdAt}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteTodo(item.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Add Task Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a new task..."
              placeholderTextColor="#A1A1AA"
              value={inputTitle}
              onChangeText={setInputTitle}
              onSubmitEditing={handleAddTodo}
              returnKeyType="done"
            />

            <View style={styles.inputControlsRow}>
              {/* Category selector */}
              <View style={styles.categoryPicker}>
                {['Work', 'Personal', 'Study'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat && styles.categoryChipActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add Button */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTodo}
                activeOpacity={0.85}
              >
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 580,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  dateSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.6,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 4,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#18181B',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18181B',
  },
  progressNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E4E4E7',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#09090B',
    borderRadius: 999,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A',
  },
  filterTabTextActive: {
    fontWeight: '600',
    color: '#09090B',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  todoCardCompleted: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEF0',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#A1A1AA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#09090B',
    borderColor: '#09090B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  todoBody: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#09090B',
    lineHeight: 20,
    marginBottom: 4,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A1A1AA',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#52525B',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#71717A',
  },
  timeText: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '400',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 6,
  },
  deleteText: {
    fontSize: 18,
    color: '#A1A1AA',
    fontWeight: '400',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    color: '#09090B',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  inputControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPicker: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  categoryChipActive: {
    backgroundColor: '#09090B',
    borderColor: '#09090B',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#09090B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
