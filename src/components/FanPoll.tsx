import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Trophy } from 'lucide-react-native';

export default function FanPoll() {
  const [pollData, setPollData] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = pollData.reduce((sum, item) => sum + (Number(item.votes) || 0), 0);

  // Fetch live poll data from backend on component mount
  useEffect(() => {
    fetchPollData();
  }, []);

  const fetchPollData = async () => {
    try {
      const response = await fetch('https://e2match.vercel.app/api/poll');
      if (!response.ok) throw new Error('Failed to fetch poll');
      const data = await response.json();

      // Map backend database format to component format if necessary
      const formattedData = data.map((item: any) => ({
        id: item.team_id || item.id,
        name: item.team_name || item.name,
        logo: item.logo || '⚽',
        votes: Number(item.votes) || 0
      }));

      setPollData(formattedData);
    } catch (error) {
      console.warn('Error fetching poll data:', error);
      // Fallback to static data if backend fails
      setPollData([
        { id: 't1', name: 'Argentina', logo: '🇦🇷', votes: 450 },
        { id: 't2', name: 'France', logo: '🇫🇷', votes: 380 },
        { id: 't4', name: 'England', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', votes: 320 },
        { id: 't3', name: 'Brazil', logo: '🇧🇷', votes: 290 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (teamId: string) => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);

    // Optimistic UI update for immediate feedback
    const updatedData = pollData.map(team => {
      if (team.id === teamId) {
        return { ...team, votes: team.votes + 1 };
      }
      return team;
    });
    updatedData.sort((a, b) => b.votes - a.votes);
    setPollData(updatedData);
    setHasVoted(true);

    // Send vote to backend
    try {
      await fetch('https://e2match.vercel.app/api/poll/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: teamId }),
      });
    } catch (error) {
      console.warn('Error submitting vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }]}>
        <ActivityIndicator size="small" color="#4f46e5" />
        <Text style={{ color: '#64748b', marginTop: 10, fontSize: 12 }}>Loading global poll...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy color="#eab308" size={24} />
        <View>
          <Text style={styles.title}>FAN POLL</Text>
          <Text style={styles.subtitle}>Who will win the World Cup 2026?</Text>
        </View>
      </View>

      <View style={styles.pollContainer}>
        {pollData.map((team) => {
          // Calculate percentage safely
          const rawPercentage = totalVotes > 0 ? (team.votes / totalVotes) * 100 : 0;
          const percentage = rawPercentage.toFixed(1);

          return (
            <TouchableOpacity
              key={team.id}
              style={styles.pollOption}
              onPress={() => handleVote(team.id)}
              disabled={hasVoted || isVoting}
              activeOpacity={0.8}
            >
              <View style={styles.optionHeader}>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamLogo}>{team.logo}</Text>
                  <Text style={styles.teamName}>{team.name}</Text>
                </View>
                {hasVoted && <Text style={styles.percentageText}>{percentage}%</Text>}
              </View>

              {hasVoted && (
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${percentage}%` }]} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {hasVoted && <Text style={styles.thanksText}>Thanks for voting! Global results updated.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  subtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  pollContainer: { gap: 12 },
  pollOption: { backgroundColor: '#1e293b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#334155' },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  teamLogo: { fontSize: 20 },
  teamName: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  percentageText: { color: '#818cf8', fontSize: 14, fontWeight: '900' },
  barBackground: { height: 6, backgroundColor: '#020617', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 3 },
  thanksText: { color: '#10b981', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 15 }
});