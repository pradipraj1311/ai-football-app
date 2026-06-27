import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform, ScrollView, PermissionsAndroid, Alert } from 'react-native';
import { Activity, Calendar, History, ListOrdered, Shield, Trophy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

import Navbar from './src/components/Navbar';
import MatchCard from './src/components/MatchCard';
import MatchDetails from './src/components/MatchDetails';
import AiCommentaryCard from './src/components/AiCommentaryCard';
import AiForecasterCard from './src/components/AiForecasterCard';
import { fetchLiveMatches } from './src/api/matchApi';
import FanPoll from './src/components/FanPoll';
import StandingsTable from './src/components/StandingsTable';
import { GLOBAL_TEAMS_DIRECTORY } from './src/data';
// Note: background-message handler is registered in index.js (it must be
// registered at module load time, not inside a React component).
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

  // --- Push Notification Setup ---
  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        // POST_NOTIFICATIONS permission is only required for Android 13+ (API level 33)
        if (Platform.Version >= 33) {
          try {
            // First, check if we already have permission
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (hasPermission) {
              console.log('Notification permission already granted.');
              getFcmToken();
              return; // Permission already there, no need to ask
            }

            // If not, request it using the standard system dialog
            const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (status === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Notification permission granted.');
              getFcmToken();
            } else {
              console.log('Notification permission denied by user.');
              // This alert is shown *after* the user denies the system prompt.
              Alert.alert(
                'Permission Denied',
                'You will not receive push notifications. To enable them, please go to your app settings.'
              );
            }
          } catch (err) {
            console.warn('Requesting notification permission failed', err);
          }
        } else {
          // On Android 12 and below, permission is granted by default and doesn't need to be asked.
          console.log('On Android 12 or below, no permission request is needed.');
          getFcmToken();
        }
      }
    };

    const getFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('================================================');
        console.log('Your Firebase Cloud Messaging (FCM) token is:');
        console.log(token);
        console.log('================================================');

        await messaging().subscribeToTopic('global_goal_alerts');
        console.log('Successfully subscribed to topic: global_goal_alerts');

        // TODO: Send this token to your backend server!
        // Your backend needs this token to send notifications to this specific device.
      } catch (error) {
        console.log('Error getting FCM token or subscribing to topic:', error);
      }
    };

    setupNotifications();

    // 3. Listen for foreground messages (when the app is open)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in the foreground!', JSON.stringify(remoteMessage));
      Alert.alert('New Notification', remoteMessage.notification?.title + '\n' + remoteMessage.notification?.body);
    });

    return unsubscribe; // Unsubscribe when the component unmounts
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

  const filteredMatches = matches.filter((m: any) => {
    if (activeTab === 'LIVE') return m.status === 'LIVE';
    if (activeTab === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'SCHEDULED';
    if (activeTab === 'FINISHED') return m.status === 'FINISHED' || m.status === 'FT';
    return true;
  });

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
            ) : filteredMatches.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 14, fontWeight: 'bold' }}>No matches found for this category.</Text>
              </View>
            ) : (
              <FlatList
                data={filteredMatches}
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