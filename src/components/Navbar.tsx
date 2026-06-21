//  Renders the top navigation bar with logo and tagline

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrainCircuit } from 'lucide-react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <View style={styles.iconBox}>
          <BrainCircuit color="#ffffff" size={24} />
        </View>
        <View>
          <Text style={styles.logoText}>
            E2match<Text style={styles.logoHighlight}>.ai</Text>
          </Text>
          <Text style={styles.tagline}>Live match insights</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#0B1121', 
    borderBottomWidth: 1, 
    borderBottomColor: '#1e293b'
  },
  logoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  iconBox: {
    width: 42, 
    height: 42, 
    borderRadius: 12,
    backgroundColor: '#4f46e5', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#ffffff',
    letterSpacing: -0.5 
  },
  logoHighlight: { 
    color: '#818cf8' 
  }, 
  tagline: { 
    fontSize: 10, 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: 1,
    marginTop: 2
  }
});