import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { BrainCircuit, AlertTriangle, Target, Zap, TrendingUp } from 'lucide-react-native';
import { fetchAiPrediction } from '../api/matchApi';

export default function AIPredictor({ match }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!match) return;
    
    setLoading(true);
    setError(null);

    fetchAiPrediction(match)
      .then((predictionData) => {
        if (!predictionData) {
          throw new Error("Could not load AI analysis.");
        }
        setData(predictionData);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [match]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 250 }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Synchronizing Intelligence Streams...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 200 }]}>
        <AlertTriangle color="#ef4444" size={32} />
        <Text style={styles.errorTitle}>Neural Engine Offline</Text>
        <Text style={styles.errorText}>Could not fetch live AI prediction.</Text>
      </View>
    );
  }

  const pHome = data.winProbability?.home || 33;
  const pDraw = data.winProbability?.draw || 34;
  const pAway = data.winProbability?.away || 33;
  
  const homeCode = typeof match.homeTeam === 'object' ? match.homeTeam.code : String(match.homeTeam || 'HOM').substring(0, 3).toUpperCase();
  const awayCode = typeof match.awayTeam === 'object' ? match.awayTeam.code : String(match.awayTeam || 'AWY').substring(0, 3).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap color="#818cf8" size={16} />
        <Text style={styles.headerTitle}>AI TACTICAL FORECASTER</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.outcomeContainer}>
          <View>
            <Text style={styles.label}>PROJECTED OUTCOME</Text>
            <View style={styles.scoreRow}>
              <Target color="#10b981" size={18} />
              <Text style={styles.scoreText}>{data.suggestedScore}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>MODEL STATE</Text>
            <View style={styles.badge}>
              <View style={styles.dot} />
              <Text style={styles.badgeText}>LIVE ENGINE</Text>
            </View>
          </View>
        </View>

        <View style={styles.probContainer}>
          <Text style={styles.label}>WIN PROBABILITY</Text>
          <View style={styles.probLabels}>
            <Text style={styles.probLabelText}>{homeCode} {pHome}%</Text>
            <Text style={styles.probLabelText}>DRAW {pDraw}%</Text>
            <Text style={styles.probLabelText}>{awayCode} {pAway}%</Text>
          </View>
          <View style={styles.barBackground}>
            <View style={[styles.barHome, { width: `${pHome}%` }]} />
            <View style={[styles.barDraw, { width: `${pDraw}%` }]} />
            <View style={[styles.barAway, { width: `${pAway}%` }]} />
          </View>
        </View>

        <View style={styles.matrixContainer}>
          <View style={styles.matrixHeader}>
            <TrendingUp color="#818cf8" size={14} />
            <Text style={styles.matrixTitle}>LIVE MATRIX OVERVIEW</Text>
          </View>
          <Text style={styles.matrixText}>{data.analysis}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0B1121', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { color: '#ffffff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  content: { padding: 16, gap: 20 },
  
  outcomeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
  label: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreText: { color: '#ffffff', fontSize: 20, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(79, 70, 229, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(79, 70, 229, 0.3)' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#818cf8' },
  badgeText: { color: '#818cf8', fontSize: 10, fontWeight: 'bold' },

  probContainer: { gap: 8 },
  probLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  probLabelText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  barBackground: { height: 6, flexDirection: 'row', borderRadius: 3, overflow: 'hidden', backgroundColor: '#1e293b' },
  barHome: { backgroundColor: '#10b981', height: '100%' },
  barDraw: { backgroundColor: '#64748b', height: '100%' },
  barAway: { backgroundColor: '#3b82f6', height: '100%' },

  matrixContainer: { borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 16 },
  matrixHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  matrixTitle: { color: '#94a3b8', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  matrixText: { color: '#cbd5e1', fontSize: 12, lineHeight: 20 },

  loadingText: { color: '#818cf8', marginTop: 12, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  errorTitle: { color: '#ef4444', fontSize: 14, fontWeight: 'bold', marginTop: 12 },
  errorText: { color: '#64748b', fontSize: 12, marginTop: 4 }
});