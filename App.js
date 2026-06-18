
// Purpose: Main entry point initializing the layout and importing components

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Activity, Calendar, History, ListOrdered, Shield, Trophy } from 'lucide-react-native';

// Importing custom components
import Navbar from './src/components/Navbar';
import MatchCard from './src/components/MatchCard';

export default function App() {
  const [activeTab, setActiveTab] = useState('LIVE');

  const menuItems = [
    { id: 'LIVE', label: 'Live', icon: Activity },
    { id: 'UPCOMING', label: 'Upcoming', icon: Calendar },
    { id: 'FINISHED', label: 'Results', icon: History },
    { id: 'STANDINGS', label: 'Table', icon: ListOrdered },
    { id: 'TEAMS', label: 'Teams', icon: Shield },
    { id: 'POLL', label: 'Poll', icon: Trophy },
  ];

  const dummyMatches = [
    { id: '1', home: 'France', away: 'Senegal', homeScore: 3, awayScore: 1, time: 'FT', hasHighlight: true },
    { id: '2', home: 'England', away: 'Croatia', homeScore: 4, awayScore: 2, time: 'FT', hasHighlight: true },
    { id: '3', home: 'Basake Holy Stars', away: 'Aduana Stars', homeScore: 0, awayScore: 0, time: '75\'', hasHighlight: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1121" />

      <Navbar />

      <View style={styles.menuWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuContainer}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => setActiveTab(item.id)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                {item.id === 'LIVE' && isActive ? (
                  <View style={styles.liveIndicator} />
                ) : (
                  <IconComponent color={isActive ? "#ffffff" : "#94a3b8"} size={14} />
                )}
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={dummyMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  menuWrapper: { backgroundColor: '#0B1121', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingVertical: 12 },
  menuContainer: { paddingHorizontal: 15, gap: 8 },
  tabButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
  tabButtonActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#94a3b8', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabTextActive: { color: '#ffffff' },
  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  listContainer: { padding: 15, gap: 15 }
});