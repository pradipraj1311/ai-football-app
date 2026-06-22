// App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform, ScrollView } from 'react-native';
import { Activity, Calendar, History, ListOrdered, Shield, Trophy } from 'lucide-react-native';
import Navbar from './src/components/Navbar';
import MatchCard from './src/components/MatchCard';
import MatchDetails from './src/components/MatchDetails';
import AiCommentaryCard from './src/components/AiCommentaryCard';
import AiForecasterCard from './src/components/AiForecasterCard';
import { fetchLiveMatches } from './src/api/matchApi';
import FanPoll from './src/components/FanPoll';
import { GLOBAL_TEAMS_DIRECTORY } from './src/data';

export default function App() {
  const [activeTab, setActiveTab] = useState('LIVE');
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const menuItems = [
    { id: 'LIVE', label: 'Live', icon: Activity },
    { id: 'UPCOMING', label: 'Upcoming', icon: Calendar },
    { id: 'FINISHED', label: 'Results', icon: History },
    { id: 'STANDINGS', label: 'Table', icon: ListOrdered },
    { id: 'TEAMS', label: 'Teams', icon: Shield },
    { id: 'POLL', label: 'Poll', icon: Trophy },
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

  if (selectedMatch) {
    return <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1121" translucent={true} />
      <View style={styles.container}>
        <Navbar />

        <View style={styles.menuWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuContainer}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity key={item.id} onPress={() => setActiveTab(item.id)} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
                  {item.id === 'LIVE' && isActive ? <View style={styles.liveIndicator} /> : <IconComponent color={isActive ? "#ffffff" : "#64748b"} size={14} />}
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
            {activeTab === 'POLL' ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                <FanPoll />
              </ScrollView>
            ) : activeTab === 'TEAMS' ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
                  {GLOBAL_TEAMS_DIRECTORY.map((team) => (
                    <TouchableOpacity key={team.id} style={styles.teamCard}>
                      <Text style={styles.teamLogoGrid}>{team.logo}</Text>
                      <Text style={styles.teamNameGrid}>{team.name}</Text>
                      <Text style={styles.teamCodeGrid}>{team.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={matches}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
                ListHeaderComponent={
                  activeTab === 'LIVE' ? (
                    <View style={{ marginBottom: 10 }}>
                      <AiCommentaryCard />
                      <AiForecasterCard />
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <MatchCard item={item} onPress={() => setSelectedMatch(item)} />
                )}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B1121' },
  container: { flex: 1, backgroundColor: '#020617', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  menuWrapper: { backgroundColor: '#0B1121', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingVertical: 12, paddingHorizontal: 12 },
  menuContainer: { paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
  tabButtonActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabTextActive: { color: '#ffffff' },
  liveIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' },
  listContainer: { padding: 15, gap: 15 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  teamCard: { backgroundColor: '#0B1121', width: '48%', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  teamLogoGrid: { fontSize: 36, marginBottom: 8 },
  teamNameGrid: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  teamCodeGrid: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1, backgroundColor: '#1e293b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});