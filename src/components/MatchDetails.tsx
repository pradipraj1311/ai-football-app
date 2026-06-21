import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { ArrowLeft, BrainCircuit, Activity } from 'lucide-react-native';
import { fetchAiPrediction } from '../api/matchApi';

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ArrowLeft, BrainCircuit, Activity } from 'lucide-react-native';

export default function MatchDetails({ match, onBack }: { match: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('ANALYSIS');
  const [aiData, setAiData] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'ANALYSIS' && !aiData) {
      loadAiData();
    }
  }, [activeTab]);

  const loadAiData = async () => {
    setIsAiLoading(true);
    const data = await fetchAiPrediction(match);
    setAiData(data);
    setIsAiLoading(false);
  };

 const renderContent = () => {
    if (activeTab === 'ANALYSIS') {
      return (
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <BrainCircuit color="#818cf8" size={20} />
            <Text style={styles.aiTitle}>AI TACTICAL ANALYSIS</Text>
          </View>
          
          {isAiLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#818cf8" />
              <Text style={{ color: '#64748b', fontSize: 10, marginTop: 10, textTransform: 'uppercase' }}>Generating Insights...</Text>
            </View>
          ) : aiData ? (
            <View>
              <Text style={styles.aiText}>{aiData.analysis}</Text>
              
              {aiData.vulnerabilities && (
                <View style={{ marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
                  <Text style={{ color: '#ef4444', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 }}>KEY VULNERABILITIES</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}><Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{match.home}:</Text> {aiData.vulnerabilities.home}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}><Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{match.away}:</Text> {aiData.vulnerabilities.away}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.aiText}>AI analysis is currently unavailable.</Text>
          )}
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B1121' },
  container: { flex: 1, backgroundColor: '#020617', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
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
  tabContainer: { flexDirection: 'row', backgroundColor: '#0B1121', borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#4f46e5' },
  tabText: { color: '#64748b', fontSize: 12, fontWeight: 'bold' },
  tabTextActive: { color: '#ffffff' },
  aiBox: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  aiTitle: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  aiText: { color: '#94a3b8', fontSize: 14, lineHeight: 22 }
});