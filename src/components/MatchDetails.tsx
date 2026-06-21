//  Full screen view for match analysis and detailed statistics

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ArrowLeft, BrainCircuit, Activity, Swords, Youtube } from 'lucide-react-native';

export default function MatchDetails({ match, onBack }: { match: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('ANALYSIS');

  const renderContent = () => {
    if (activeTab === 'ANALYSIS') {
      return (
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <BrainCircuit color="#818cf8" size={20} />
            <Text style={styles.aiTitle}>AI TACTICAL ANALYSIS</Text>
          </View>
          <Text style={styles.aiText}>
            Generating real-time tactical breakdown for {match.home} vs {match.away}. 
            The AI model is currently analyzing team formations, recent form, and live match data to provide key insights.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.aiBox}>
        <Text style={styles.aiText}>Content for {activeTab} will appear here.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.scoreCard}>
          <Text style={styles.leagueText}>{match.competition || 'FIFA WORLD CUP 2026'}</Text>
          <View style={styles.scoreRow}>
            <View style={styles.teamColumn}>
              <Text style={styles.teamLogo}>⚽</Text>
              <Text style={styles.teamName}>{match.home}</Text>
            </View>
            
            <View style={styles.centerColumn}>
              <Text style={styles.scoreText}>{match.homeScore} - {match.awayScore}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{match.time}</Text>
              </View>
            </View>

            <View style={styles.teamColumn}>
              <Text style={styles.teamLogo}>⚽</Text>
              <Text style={styles.teamName}>{match.away}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('ANALYSIS')} style={[styles.tabBtn, activeTab === 'ANALYSIS' && styles.tabBtnActive]}>
            <BrainCircuit color={activeTab === 'ANALYSIS' ? "#ffffff" : "#64748b"} size={16} />
            <Text style={[styles.tabText, activeTab === 'ANALYSIS' && styles.tabTextActive]}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('TELEMETRY')} style={[styles.tabBtn, activeTab === 'TELEMETRY' && styles.tabBtnActive]}>
            <Activity color={activeTab === 'TELEMETRY' ? "#ffffff" : "#64748b"} size={16} />
            <Text style={[styles.tabText, activeTab === 'TELEMETRY' && styles.tabTextActive]}>Telemetry</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#0B1121', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backButton: { padding: 5 },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 15 },
  scoreCard: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  leagueText: { color: '#64748b', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center', marginBottom: 20 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamColumn: { alignItems: 'center', flex: 1 },
  teamLogo: { fontSize: 40, marginBottom: 10 },
  teamName: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  centerColumn: { alignItems: 'center', paddingHorizontal: 15 },
  scoreText: { color: '#ffffff', fontSize: 32, fontWeight: '900', fontFamily: 'monospace', marginBottom: 5 },
  statusBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  statusText: { color: '#ef4444', fontSize: 10, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#0B1121', borderRadius: 12, p: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#64748b', fontSize: 12, fontWeight: 'bold' },
  tabTextActive: { color: '#ffffff' },
  aiBox: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  aiTitle: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  aiText: { color: '#94a3b8', fontSize: 14, lineHeight: 22 }
});