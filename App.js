//  Main entry point handling list and details routing

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Activity, Calendar, History, ListOrdered, Shield, Trophy } from 'lucide-react-native';

import Navbar from './src/components/Navbar';
import MatchCard from './src/components/MatchCard';
import MatchDetails from './src/components/MatchDetails';
import AiCommentaryCard from './src/components/AiCommentaryCard';
import AiForecasterCard from './src/components/AiForecasterCard';
import { fetchLiveMatches } from './src/api/matchApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('LIVE');
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Navigation State
  const [selectedMatch, setSelectedMatch] = useState(null);

  const menuItems = [
    { id: 'LIVE', label: 'Live', icon: Activity },
    { id: 'UPCOMING', label: 'Upcoming', icon: Calendar },
    { id: 'FINISHED', label: 'Results', icon: History },
    { id: 'STANDINGS', label: 'Table', icon: ListOrdered },
  ];

  useEffect(() => {
    loadMatchData();
  }, []);

  const loadMatchData = async () => {
    setIsLoading(true);
    const data = await fetchLiveMatches();
    setMatches(data);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    const freshData = await fetchLiveMatches();
    setMatches(freshData);
    setIsRefreshing(false);
  };

  // If a match is clicked, render the MatchDetails screen instead of the list
  if (selectedMatch) {
    return <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

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
              <TouchableOpacity key={item.id} onPress={() => setActiveTab(item.id)} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
                {item.id === 'LIVE' && isActive ? <View style={styles.liveIndicator} /> : <IconComponent color={isActive ? "#ffffff" : "#94a3b8"} size={14} />}
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
            ListHeaderComponent={
              <View style={{ marginBottom: 10 }}>
                <AiCommentaryCard />
                <AiForecasterCard />
              </View>
            }
            renderItem={({ item }) => (
              <MatchCard 
                item={item} 
                onPress={() => setSelectedMatch(item)} 
              />
            )}
          />
        </View>
      )}
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
  listContainer: { padding: 15, gap: 15 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});