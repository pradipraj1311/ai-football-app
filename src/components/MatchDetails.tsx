import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { ArrowLeft, BrainCircuit, Activity, Youtube } from 'lucide-react-native';
import { fetchAiPrediction } from '../api/matchApi';
import YoutubePlayer from "react-native-youtube-iframe"; 

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
                            {/* AI Predicted Score Header */}
                            <View style={styles.predictionHeader}>
                                <Text style={styles.predictionLabel}>AI PREDICTED SCORE</Text>
                                <Text style={styles.predictedScoreText}>{aiData.suggestedScore || 'N/A'}</Text>
                            </View>

                            {/* Win Probability Bar */}
                            <View style={styles.probabilityContainer}>
                                <View style={[styles.probBar, { flex: aiData.winProbability?.home || 33, backgroundColor: '#4f46e5' }]} />
                                <View style={[styles.probBar, { flex: aiData.winProbability?.draw || 34, backgroundColor: '#64748b' }]} />
                                <View style={[styles.probBar, { flex: aiData.winProbability?.away || 33, backgroundColor: '#ef4444' }]} />
                            </View>

                            <View style={styles.probLabels}>
                                <Text style={styles.probText}>{match.home} ({aiData.winProbability?.home || 33}%)</Text>
                                <Text style={styles.probText}>Draw ({aiData.winProbability?.draw || 34}%)</Text>
                                <Text style={styles.probText}>{match.away} ({aiData.winProbability?.away || 33}%)</Text>
                            </View>

                            {/* Existing Analysis Text */}
                            <Text style={[styles.aiText, { marginTop: 15 }]}>{aiData.analysis}</Text>

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

        if (activeTab === 'TELEMETRY') {
            const stats = match.stats || { possession: { home: 50, away: 50 }, shots: { home: 0, away: 0 }, shotsOnTarget: { home: 0, away: 0 }, corners: { home: 0, away: 0 } };
            
            const renderStatBar = (label: string, homeVal: number, awayVal: number, isPercentage: boolean = false) => {
                const total = homeVal + awayVal || 1; 
                const homePerc = (homeVal / total) * 100;
                const awayPerc = (awayVal / total) * 100;
                
                return (
                    <View style={styles.statRow} key={label}>
                        <View style={styles.statLabels}>
                            <Text style={styles.statValue}>{homeVal}{isPercentage ? '%' : ''}</Text>
                            <Text style={styles.statName}>{label}</Text>
                            <Text style={styles.statValue}>{awayVal}{isPercentage ? '%' : ''}</Text>
                        </View>
                        <View style={styles.statBarContainer}>
                            <View style={[styles.statBarHome, { width: `${homePerc}%` }]} />
                            <View style={[styles.statBarAway, { width: `${awayPerc}%` }]} />
                        </View>
                    </View>
                );
            };

            return (
                <View style={styles.aiBox}>
                    <View style={styles.aiHeader}>
                        <Activity color="#10b981" size={20} />
                        <Text style={[styles.aiTitle, { color: '#10b981' }]}>LIVE MATCH TELEMETRY</Text>
                    </View>

                    {match.status === 'UPCOMING' || match.status === 'SCHEDULED' ? (
                        <Text style={styles.aiText}>Telemetry data will be available once the match starts.</Text>
                    ) : (
                        <View style={styles.statsContainer}>
                            {renderStatBar('Ball Possession', stats.possession?.home || 50, stats.possession?.away || 50, true)}
                            {renderStatBar('Total Shots', stats.shots?.home || 0, stats.shots?.away || 0)}
                            {renderStatBar('Shots on Target', stats.shotsOnTarget?.home || 0, stats.shotsOnTarget?.away || 0)}
                            {renderStatBar('Corner Kicks', stats.corners?.home || 0, stats.corners?.away || 0)}
                            {renderStatBar('Fouls', stats.fouls?.home || 0, stats.fouls?.away || 0)}
                            {renderStatBar('Yellow Cards', stats.yellowCards?.home || 0, stats.yellowCards?.away || 0)}
                        </View>
                    )}
                </View>
            );
        }

        if (activeTab === 'HIGHLIGHTS') {
            return (
                <View style={styles.aiBox}>
                    <View style={styles.aiHeader}>
                        <Youtube color="#ef4444" size={20} />
                        <Text style={[styles.aiTitle, { color: '#ffffff' }]}>OFFICIAL HIGHLIGHTS</Text>
                    </View>
                    
                    {match.youtubeHighlightId ? (
                        <View style={styles.videoContainer}>
                            <YoutubePlayer
                                height={200}
                                play={true}
                                videoId={match.youtubeHighlightId}
                                forceAndroidAutoplay={true}
                            />
                            <Text style={styles.videoSubText}>
                                Watch the key moments from {match.home} vs {match.away}. 
                                Courtesy of official broadcasters.
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.aiText}>Highlights are currently not available for this match.</Text>
                    )}
                </View>
            );
        }

        return null;
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
                        {match.youtubeHighlightId && (
                            <TouchableOpacity onPress={() => setActiveTab('HIGHLIGHTS')} style={[styles.tabBtn, activeTab === 'HIGHLIGHTS' && styles.tabBtnActive]}>
                                <Youtube color={activeTab === 'HIGHLIGHTS' ? "#ffffff" : "#64748b"} size={16} />
                                <Text style={[styles.tabText, activeTab === 'HIGHLIGHTS' && styles.tabTextActive]}>Highlights</Text>
                            </TouchableOpacity>
                        )}
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
    aiText: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
    predictionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
    predictionLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    predictedScoreText: { color: '#10b981', fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },
    probabilityContainer: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8, gap: 2 },
    probBar: { height: '100%' },
    probLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    probText: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
    statsContainer: { gap: 15, marginTop: 10 },
    statRow: { gap: 8 },
    statLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statValue: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
    statName: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    statBarContainer: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#1e293b', gap: 2 },
    statBarHome: { height: '100%', backgroundColor: '#4f46e5' },
    statBarAway: { height: '100%', backgroundColor: '#ef4444' },
    videoContainer: { marginTop: 10, borderRadius: 12, overflow: 'hidden', backgroundColor: '#020617' },
    videoSubText: { color: '#94a3b8', fontSize: 12, marginTop: 12, lineHeight: 18, textAlign: 'center' }
});