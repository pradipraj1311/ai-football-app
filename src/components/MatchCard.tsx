//  Displays individual match data and handles click events

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MatchCard({ item, onPress }: { item: any, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.leagueText}>{item.competition || 'FIFA WORLD CUP 2026'}</Text>
        <View style={styles.headerRight}>
          {item.hasHighlight && (
            <View style={styles.highlightBadge}>
              <Text style={styles.highlightText}>HIGHLIGHT</Text>
            </View>
          )}
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamRow}>
          <Text style={styles.teamLogo}>⚽</Text>
          <Text style={styles.teamName}>{item.home}</Text>
          <Text style={styles.scoreText}>{item.homeScore}</Text>
        </View>
        <View style={styles.teamRow}>
          <Text style={styles.teamLogo}>⚽</Text>
          <Text style={styles.teamName}>{item.away}</Text>
          <Text style={styles.scoreText}>{item.awayScore}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  matchCard: { 
    backgroundColor: '#0B1121', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#1e293b',
    marginBottom: 15,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  leagueText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  highlightBadge: { backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)' },
  highlightText: { color: '#eab308', fontSize: 9, fontWeight: 'bold' },
  timeText: { color: '#ef4444', fontSize: 11, fontWeight: 'bold' },
  teamsContainer: { gap: 12 },
  teamRow: { flexDirection: 'row', alignItems: 'center' },
  teamLogo: { fontSize: 20, marginRight: 12 },
  teamName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  scoreText: { color: '#ffffff', fontSize: 18, fontWeight: '900', fontFamily: 'monospace' }
});