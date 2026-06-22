
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { INITIAL_POLL_DATA } from '../data';

export default function FanPoll() {
  const [pollData, setPollData] = useState(INITIAL_POLL_DATA);
  const [hasVoted, setHasVoted] = useState(false);
  
  const totalVotes = pollData.reduce((sum, item) => sum + item.votes, 0);

  const handleVote = (teamId: string) => {
    if (hasVoted) return;
    
    const updatedData = pollData.map(team => {
      if (team.id === teamId) {
        return { ...team, votes: team.votes + 1 };
      }
      return team;
    });
    
    // Sort by votes
    updatedData.sort((a, b) => b.votes - a.votes);
    
    setPollData(updatedData);
    setHasVoted(true);
  };

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
          const percentage = ((team.votes / totalVotes) * 100).toFixed(1);
          
          return (
            <TouchableOpacity 
              key={team.id} 
              style={styles.pollOption} 
              onPress={() => handleVote(team.id)}
              disabled={hasVoted}
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