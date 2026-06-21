
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { Activity, Calendar, History, ListOrdered } from 'lucide-react-native';

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

  if (selectedMatch) {
    return <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1121" translucent={true} />
      <View style={styles.container}>
        <Navbar />

        <View style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity key={item.id} onPress={() => setActiveTab(item.id)} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
                  {item.id === 'LIVE' && isActive ? <View style={styles.liveIndicator} /> : <IconComponent color={isActive ? "#ffffff" : "#64748b"} size={16} />}
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
                <MatchCard item={item} onPress={() => setSelectedMatch(item)} />
              )}
            />
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
  menuContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  tabButton: { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#1e293b', paddingVertical: 10, borderRadius: 10, gap: 6 },
  tabButtonActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabTextActive: { color: '#ffffff' },
  liveIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' },
  listContainer: { padding: 15, gap: 15 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});