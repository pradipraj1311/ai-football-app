import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform, ScrollView, PermissionsAndroid, Alert, LayoutAnimation, UIManager } from 'react-native';
import { Activity, Calendar, History, ListOrdered, Shield, Trophy, BellRing } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Modular imports for Firebase v22+
import { getMessaging, getToken, subscribeToTopic, onMessage } from '@react-native-firebase/messaging';

import Navbar from './src/components/Navbar';
import MatchCard from './src/components/MatchCard';
import MatchDetails from './src/components/MatchDetails';
import TeamProfile from './src/components/TeamProfile';
import AiCommentaryCard from './src/components/AiCommentaryCard';
import AiForecasterCard from './src/components/AiForecasterCard';
import { fetchLiveMatches, fetchUpcomingMatches, fetchCompletedMatches, fetchTeams } from './src/api/matchApi';
import FanPoll from './src/components/FanPoll';
import StandingsTable from './src/components/StandingsTable';

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('LIVE');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const menuItems = [
    { id: 'LIVE', label: 'Live', icon: Activity },
    { id: 'UPCOMING', label: 'Upcoming', icon: Calendar },
    { id: 'FINISHED', label: 'Results', icon: History },
    { id: 'STANDINGS', label: 'Table', icon: ListOrdered },
    { id: 'TEAMS', label: 'Teams', icon: Shield },
    { id: 'POLL', label: 'Poll', icon: Trophy },
  ];

  // Primary Data Loading
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch matches and teams in parallel for optimal performance
        const [matchData, teamData] = await Promise.all([
          fetchLiveMatches(),
          fetchTeams(),
        ]);

        setMatches(matchData || []);

        // Priority: 1. Server Data, 2. Local Fallback
        if (teamData && teamData.length > 0) {
          setTeams(teamData);
        } else {
          console.warn("Could not fetch teams from API. No fallback data available.");
          setTeams([]);
        }
      } catch (error) {
        console.error("Failed to load initial app data:", error);
        setTeams([]); // Ensure UI doesn't break on fatal error
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Push Notification Setup
  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          try {
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (hasPermission) {
              await getFcmToken();
              return;
            }

            const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (status === PermissionsAndroid.RESULTS.GRANTED) {
              await getFcmToken();
            } else {
              Alert.alert(
                'Permission Denied',
                'You will not receive push notifications. To enable them, please go to your app settings.'
              );
            }
          } catch (err) {
            console.warn('Requesting notification permission failed', err);
          }
        } else {
          await getFcmToken();
        }
      }
    };

    const getFcmToken = async () => {
      try {
        const messagingInstance = getMessaging();
        const token = await getToken(messagingInstance);
        await subscribeToTopic(messagingInstance, 'global_goal_alerts');
      } catch (error) {
        console.warn('Error getting FCM token or subscribing to topic:', error);
      }
    };

    setupNotifications();

    const messagingInstance = getMessaging();
    const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
      Alert.alert('New Notification', remoteMessage.notification?.title + '\n' + remoteMessage.notification?.body);
    });

    return unsubscribe;
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Refresh matches for the current tab and also refresh the teams list
    const [freshMatchData, freshTeamData] = await Promise.all([
      loadMatchesForTab(activeTab),
      fetchTeams()
    ]);
    setMatches(freshMatchData);
    if (freshTeamData && freshTeamData.length > 0) {
      setTeams(freshTeamData);
    }
    setIsRefreshing(false);
  };

  const handleTabChange = (tabId) => {
    // Add a smooth animation for the tab transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tabId);
    setSelectedTeam(null);
  };

  // Routing Logic
  if (selectedMatch) {
    return <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  if (selectedTeam) {
    return <TeamProfile team={selectedTeam} onBack={() => setSelectedTeam(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1121" translucent={true} />
      <View style={styles.container}>
        <Navbar />

        {/* 🌟 NEW: DISCOVERABLE FOLLOW BANNER 🌟 */}
        {activeTab !== 'TEAMS' && !selectedTeam && !selectedMatch && (
          <TouchableOpacity
            style={styles.followBanner}
            onPress={() => handleTabChange('TEAMS')}
          >
            <View style={styles.bannerIconBg}>
              <BellRing color="#10b981" size={20} />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Never miss a goal!</Text>
              <Text style={styles.bannerSub}>Pick your favorite team for instant alerts.</Text>
            </View>
            <View style={styles.bannerArrow}>
              <Text style={{ color: '#fff', fontSize: 16 }}>→</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.menuWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuContainer}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity key={item.id} onPress={() => handleTabChange(item.id)} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
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
            {activeTab === 'STANDINGS' ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                <StandingsTable />
              </ScrollView>
            ) : activeTab === 'POLL' ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                <FanPoll />
              </ScrollView>
            ) : activeTab === 'TEAMS' ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
                {/* ✨ NEW: INSTRUCTIONAL TEXT FOR TEAMS TAB ✨ */}
                <Text style={styles.teamsInstruction}>
                  Select your favorite team to get instant goal alerts!
                </Text>
                <View style={styles.teamsGrid}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team.id}
                      style={styles.teamCard}
                      onPress={() => setSelectedTeam(team)}
                    >
                      <Text style={styles.teamLogoGrid}>{team.logo}</Text>
                      <Text style={styles.teamNameGrid}>{team.name}</Text>
                      <Text style={styles.teamCodeGrid}>{team.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : ['LIVE', 'UPCOMING', 'FINISHED'].includes(activeTab) && matches.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No matches found for this category.</Text>
              </View>
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
  followBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  bannerIconBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bannerSub: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  menuWrapper: { backgroundColor: '#0B1121', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingVertical: 12, paddingHorizontal: 12 },
  menuContainer: { paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
  tabButtonActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tabTextActive: { color: '#ffffff' },
  liveIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' },
  listContainer: { padding: 15, gap: 15 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  teamsInstruction: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  teamsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  teamCard: { backgroundColor: '#0B1121', width: '48%', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  teamLogoGrid: { fontSize: 40, marginBottom: 12 },
  teamNameGrid: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  teamCodeGrid: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1, backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14, fontWeight: 'bold' }
});