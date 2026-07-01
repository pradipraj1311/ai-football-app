import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BrainCircuit, CheckCircle2, XCircle, Trophy } from 'lucide-react-native';

export default function TriviaQuiz() {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch('https://e2match.vercel.app/api/trivia')
      .then(res => res.json())
      .then(data => {
        setQuiz(data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Quiz Fetch Error', err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (option: string) => {
    if (selectedOpt) return; // Prevent double click
    setSelectedOpt(option);
    
    if (option === quiz[currentQ].a) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQ + 1 < quiz.length) {
        setCurrentQ(prev => prev + 1);
        setSelectedOpt(null);
      } else {
        setIsFinished(true);
      }
    }, 2000); // 2 seconds to read the explanation
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </View>
    );
  }

  if (!quiz.length) {
    return <Text style={{ color: '#fff' }}>No quiz available today.</Text>;
  }

  if (isFinished) {
    return (
      <View style={styles.resultBox}>
        <Trophy color="#f59e0b" size={48} style={{ marginBottom: 10 }} />
        <Text style={styles.resultTitle}>Quiz Completed!</Text>
        <Text style={styles.scoreText}>You scored {score} out of {quiz.length}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setCurrentQ(0); setScore(0); setSelectedOpt(null); setIsFinished(false); }}>
          <Text style={styles.retryText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const qData = quiz[currentQ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BrainCircuit color="#818cf8" size={20} />
        <Text style={styles.headerText}>DAILY TRIVIA ({currentQ + 1}/{quiz.length})</Text>
      </View>

      <Text style={styles.questionText}>{qData.q}</Text>

      <View style={styles.optionsContainer}>
        {qData.options.map((opt: string, idx: number) => {
          let btnStyle = styles.optionBtn;
          let textStyle = styles.optionText;
          let showIcon = null;

          if (selectedOpt) {
            if (opt === qData.a) {
              btnStyle = styles.correctBtn;
              textStyle = styles.correctText;
              showIcon = <CheckCircle2 color="#10b981" size={16} />;
            } else if (opt === selectedOpt) {
              btnStyle = styles.wrongBtn;
              textStyle = styles.wrongText;
              showIcon = <XCircle color="#ef4444" size={16} />;
            }
          }

          return (
            <TouchableOpacity 
              key={idx} 
              style={btnStyle} 
              activeOpacity={0.8}
              onPress={() => handleSelect(opt)}
            >
              <Text style={textStyle}>{opt}</Text>
              {showIcon}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedOpt && (
        <View style={styles.explanationBox}>
          <Text style={styles.expTitle}>Did you know?</Text>
          <Text style={styles.expText}>{qData.exp}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  container: { backgroundColor: '#0B1121', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  headerText: { color: '#818cf8', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  questionText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, lineHeight: 26 },
  optionsContainer: { gap: 10 },
  
  optionBtn: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#020617', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
  optionText: { color: '#e2e8f0', fontSize: 14, fontWeight: 'bold' },
  
  correctBtn: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#10b981' },
  correctText: { color: '#10b981', fontSize: 14, fontWeight: 'bold' },
  
  wrongBtn: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ef4444' },
  wrongText: { color: '#ef4444', fontSize: 14, fontWeight: 'bold' },

  explanationBox: { marginTop: 16, padding: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  expTitle: { color: '#60a5fa', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4 },
  expText: { color: '#bfdbfe', fontSize: 12, lineHeight: 18 },

  resultBox: { backgroundColor: '#0B1121', borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  resultTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  scoreText: { color: '#94a3b8', fontSize: 16, marginBottom: 20 },
  retryBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
  retryText: { color: '#fff', fontWeight: 'bold' }
});