
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';

export default function AiForecasterCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap color="#ffffff" size={16} />
        <Text style={styles.headerText}>AI TACTICAL FORECASTER</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.label}>PROJECTED OUTCOME</Text>
          <View style={styles.scoreWrapper}>
            <View style={styles.targetDot} />
            <Text style={styles.scoreText}>0 - 1</Text>
          </View>
        </View>

        <View style={styles.engineBox}>
          <Text style={styles.label}>MODEL STATE</Text>
          <View style={styles.liveEngineBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveEngineText}>LIVE ENGINE</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1121',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    padding: 16,
    borderRadius: 12,
  },
  statBox: {
    flex: 1,
  },
  engineBox: {
    alignItems: 'flex-end',
  },
  label: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#10b981',
    backgroundColor: 'transparent',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  liveEngineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: '#3730a3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#818cf8',
  },
  liveEngineText: {
    color: '#818cf8',
    fontSize: 9,
    fontWeight: 'bold',
  }
});