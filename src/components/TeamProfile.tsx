import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Shield, Activity, Calendar, Trophy } from 'lucide-react-native';
import { fetchLiveMatches, fetchUpcomingMatches, fetchCompletedMatches } from '../api/matchApi';
import MatchCard from './MatchCard';

export default function TeamProfile({ team, onBack }: any) {
  const [realStats, setRealStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [teamMatches, setTeamMatches] = useState<any[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

  // Fetch live team statistics from backend
  useEffect(() => {
    const fetchTeamStats = async () => {
      setIsLoadingStats(true);
      try {
        const teamId = team.id || team.code.toLowerCase();
        const response = await fetch(`https://e2match.vercel.app/api/team-stats/${teamId}`);

        if (response.ok) {
          const data = await response.json();
          setRealStats(data);
        } else {
          console.warn('Backend stats missing, using local fallback.');
        }
      } catch (error) {
        console.warn('Network error fetching team stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchTeamStats();
  }, [team]);

  // Fetch all matches (live, upcoming, finished) and filter for the current team
  useEffect(() => {
    const fetchAllMatchesForTeam = async () => {
      setIsLoadingMatches(true);
      try {
        const [live, upcoming, finished] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches(),
          fetchCompletedMatches(),
        ]);
        const allMatches = [...live, ...upcoming, ...finished];
        const filtered = allMatches.filter((m: any) => m.home === team.name || m.away === team.name);
        setTeamMatches(filtered);
      } catch (error) {
        console.error("Error fetching matches for team profile:", error);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchAllMatchesForTeam();
  }, [team]);

  // Graceful fallback to static data if backend response is delayed or fails
  const displayForm = realStats?.form || team.form || [];
  const displayStadium = realStats?.stadium || team.stadium || 'Unknown Stadium';
  const displayCountry = realStats?.country || team.country || 'Unknown Region';
  const worldRanking = realStats?.worldRanking || '--';

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft color="#94a3b8" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Main Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Text style={styles.logo}>{team.logo}</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamCountry}>{displayCountry} • Est. {team.founded}</Text>
            </View>
          </View>

          {/* Advanced Stats Loader */}
          {isLoadingStats ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 10 }}>Fetching live stats...</Text>
            </View>
          ) : (
            <>
              {/* Tactical Overview */}
              <View style={styles.tacticalContainer}>
                <View style={styles.statItem}>
                  <Trophy color="#eab308" size={14} />
                  <Text style={styles.statLabel}>World Rank</Text>
                  <Text style={styles.statValue}>{worldRanking}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Shield color="#818cf8" size={14} />
                  <Text style={styles.statLabel}>Stadium</Text>
                  <Text style={styles.statValue}>{displayStadium}</Text>
                </View>
              </View>

              {/* Form Guide */}
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <Activity color="#10b981" size={14} />
                  <Text style={styles.formTitle}>RECENT FORM</Text>
                </View>
                <View style={styles.formBoxes}>
                  {displayForm.map((result: string, index: number) => {
                    const isWin = result === 'W';
                    const isDraw = result === 'D';
                    return (
                      <View
                        key={index}
                        style={[
                          styles.formBox,
                          isWin ? styles.winBox : isDraw ? styles.drawBox : styles.lossBox
                        ]}
                      >
                        <Text style={[
                          styles.formBoxText,
                          isWin ? styles.winText : isDraw ? styles.drawText : styles.lossText
                        ]}>
                          {result}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Fixtures Section */}
        <View style={styles.matchesSection}>
          <View style={styles.sectionHeader}>
            <Calendar color="#818cf8" size={16} />
            <Text style={styles.sectionTitle}>FIXTURES & RESULTS</Text>
          </View>

          {isLoadingMatches ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text style={styles.emptyText}>Loading match schedule...</Text>
            </View>
          ) : teamMatches.length === 0 ? (
            <View style={styles.emptyState}>
              <Shield color="#334155" size={32} />
              <Text style={styles.emptyText}>No matches found for {team.name}</Text>
            </View>
          ) : (
            <View style={styles.matchList}>
              {teamMatches
                .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
                .map((match: any) => (
                  <MatchCard key={match.id} item={match} onPress={() => { }} />
                ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#0B1121', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  profileCard: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  logo: { fontSize: 48, backgroundColor: '#020617', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' },
  titleContainer: { flex: 1 },
  teamName: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  teamCountry: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },

  tacticalContainer: { flexDirection: 'row', backgroundColor: '#020617', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: '#1e293b', marginHorizontal: 10 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { color: '#ffffff', fontSize: 12, fontWeight: '900', textAlign: 'center' },

  formContainer: { backgroundColor: '#020617', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1e293b' },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  formTitle: { color: '#94a3b8', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  formBoxes: { flexDirection: 'row', gap: 8 },
  formBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  formBoxText: { fontSize: 12, fontWeight: '900' },

  winBox: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  winText: { color: '#10b981' },
  drawBox: { backgroundColor: 'rgba(100, 116, 139, 0.1)', borderColor: 'rgba(100, 116, 139, 0.3)' },
  drawText: { color: '#94a3b8' },
  lossBox: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },
  lossText: { color: '#ef4444' },

  matchesSection: { marginTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  matchList: { gap: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#0B1121', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  emptyText: { color: '#64748b', fontSize: 14, marginTop: 12, fontWeight: 'bold' }
});