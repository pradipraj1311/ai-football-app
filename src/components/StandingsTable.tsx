
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchStandings } from '../api/matchApi';

export default function StandingsTable() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    setLoading(true);
    // Passing FIFA World Cup 2026 IDs
    const data = await fetchStandings('16', '52186'); 
    setStandings(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading Table...</Text>
      </View>
    );
  }

  if (standings.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No standings available right now.</Text>
      </View>
    );
  }

  // Group standings by their 'group' property
  const groupedStandings = standings.reduce((acc, current) => {
    const groupName = current.group || 'Table';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(current);
    return acc;
  }, {});

  return (
    <View style={{ gap: 20 }}>
      {Object.keys(groupedStandings).map((groupName) => (
        <View key={groupName} style={styles.container}>
          <Text style={styles.title}>{groupName.toUpperCase()}</Text>
          
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.headerCell, { flex: 2.5, textAlign: 'left' }]}>TEAM</Text>
            <Text style={styles.headerCell}>P</Text>
            <Text style={styles.headerCell}>W</Text>
            <Text style={styles.headerCell}>D</Text>
            <Text style={styles.headerCell}>L</Text>
            <Text style={styles.headerCell}>GD</Text>
            <Text style={[styles.headerCell, { color: '#818cf8' }]}>PTS</Text>
          </View>

          {groupedStandings[groupName].map((row: any, index: number) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, { flex: 0.5, color: '#94a3b8' }]}>{row.rank}</Text>
              <Text style={[styles.cell, { flex: 2.5, textAlign: 'left', fontWeight: 'bold' }]}>
                {row.logo} {row.team}
              </Text>
              <Text style={styles.cell}>{row.played}</Text>
              <Text style={styles.cell}>{row.won}</Text>
              <Text style={styles.cell}>{row.drawn}</Text>
              <Text style={styles.cell}>{row.lost}</Text>
              <Text style={styles.cell}>{row.gd}</Text>
              <Text style={[styles.cell, { color: '#818cf8', fontWeight: '900' }]}>{row.points}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#64748b', fontSize: 12, marginTop: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  errorText: { color: '#ef4444', fontSize: 14, fontWeight: 'bold' },
  
  container: { backgroundColor: '#0B1121', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#1e293b' },
  title: { color: '#ffffff', fontSize: 12, fontWeight: '900', marginBottom: 15, textAlign: 'center', letterSpacing: 2 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 10, marginBottom: 10 },
  headerCell: { flex: 1, color: '#64748b', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(30, 41, 59, 0.4)' },
  cell: { flex: 1, color: '#ffffff', fontSize: 12, textAlign: 'center' }
});