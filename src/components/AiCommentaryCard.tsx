
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, Play } from 'lucide-react-native';

export default function AiCommentaryCard() {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <Volume2 color="#818cf8" size={20} />
        </View>
        <View>
          <Text style={styles.title}>AI AUDIO COMMENTARY</Text>
          <Text style={styles.subtitle}>Listen to real-time tactical breakdowns</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
        <Play color="#ffffff" size={14} fill="#ffffff" />
        <Text style={styles.playText}>PLAY NOW</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    padding: 10,
    borderRadius: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  playButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  playText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  }
});