import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions as D } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MovementPredictor, AnomalyDetector } from '../utils/ai-predictor';

const { width: screenWidth } = D.get('window');

export default function AdvancedDashboard({ members, alerts, onAlertPress }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [predictions, setPredictions] = useState(new Map());
  const [anomalies, setAnomalies] = useState(new Map());
  const [chartData, setChartData] = useState(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // IA instances
  const movementPredictor = new MovementPredictor();
  const anomalyDetector = new AnomalyDetector();

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulse continue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Analyser les données avec l'IA
    analyzeDataWithAI();
  }, [members]);

  const analyzeDataWithAI = () => {
    const newPredictions = new Map();
    const newAnomalies = new Map();

    members.forEach(member => {
      // Analyser l'historique de mouvement
      const analysis = movementPredictor.analyzeMovementHistory(
        member.id, 
        member.locationHistory || []
      );
      
      if (analysis) {
        newPredictions.set(member.id, analysis);
      }

      // Détecter les anomalies
      const detectedAnomalies = anomalyDetector.detectAnomalies(
        member, 
        member.locationHistory || []
      );
      
      if (detectedAnomalies.length > 0) {
        newAnomalies.set(member.id, detectedAnomalies);
      }
    });

    setPredictions(newPredictions);
    setAnomalies(newAnomalies);
    prepareChartData();
  };

  const prepareChartData = () => {
    if (!members || members.length === 0) return;

    // Données pour le graphique RSSI
    const rssiData = {
      labels: members.slice(0, 6).map(m => m.name.substring(0, 3)),
      datasets: [{
        data: members.slice(0, 6).map(m => Math.abs(m.rssi)),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2
      }]
    };

    // Données pour le graphique de batterie
    const batteryData = {
      labels: members.slice(0, 6).map(m => m.name.substring(0, 3)),
      datasets: [{
        data: members.slice(0, 6).map(m => m.battery),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
      }]
    };

    setChartData({ rssi: rssiData, battery: batteryData });
  };

  const renderPredictiveInsights = () => {
    const insights = [];
    
    predictions.forEach((prediction, memberId) => {
      const member = members.find(m => m.id === memberId);
      if (prediction.predictions && prediction.predictions.predictedLocation) {
        insights.push({
          memberId,
          memberName: member?.name || 'Unknown',
          prediction: prediction.predictions,
          confidence: prediction.predictions.predictedLocation.confidence
        });
      }
    });

    if (insights.length === 0) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>🧠 Prédictions IA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {insights.map(insight => (
            <TouchableOpacity 
              key={insight.memberId}
              style={styles.predictionCard}
              onPress={() => setSelectedMember(insight.memberId)}
            >
              <Text style={styles.predictionMember}>{insight.memberName}</Text>
              <Text style={styles.predictionText}>
                Position prédite: ({Math.round(insight.prediction.predictedLocation.x)}, {Math.round(insight.prediction.predictedLocation.y)})
              </Text>
              <Text style={[
                styles.confidenceText,
                { color: insight.confidence > 0.7 ? '#10b981' : '#f59e0b' }
              ]}>
                Confiance: {Math.round(insight.confidence * 100)}%
              </Text>
              <View style={styles.riskFactors}>
                {Object.entries(insight.prediction.riskFactors || {}).map(([key, value]) => (
                  <Text key={key} style={styles.riskFactor}>
                    {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderAnomalyAlerts = () => {
    const anomalyAlerts = [];
    
    anomalies.forEach((memberAnomalies, memberId) => {
      const member = members.find(m => m.id === memberId);
      memberAnomalies.forEach(anomaly => {
        anomalyAlerts.push({
          memberId,
          memberName: member?.name || 'Unknown',
          anomaly
        });
      });
    });

    if (anomalyAlerts.length === 0) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>⚠️ Anomalies Détectées</Text>
        {anomalyAlerts.slice(0, 3).map(alert => (
          <TouchableOpacity 
            key={`${alert.memberId}-${alert.anomaly.type}`}
            style={[
              styles.anomalyCard,
              { 
                borderColor: alert.anomaly.severity === 'CRITICAL' ? '#ef4444' : 
                           alert.anomaly.severity === 'HIGH' ? '#f59e0b' : '#3b82f6'
              }
            ]}
            onPress={() => onAlertPress(alert.anomaly)}
          >
            <View style={styles.anomalyHeader}>
              <Text style={styles.anomalyMember}>{alert.memberName}</Text>
              <Text style={[
                styles.anomalySeverity,
                { 
                  color: alert.anomaly.severity === 'CRITICAL' ? '#ef4444' : 
                         alert.anomaly.severity === 'HIGH' ? '#f59e0b' : '#3b82f6'
                }
              ]}>
                {alert.anomaly.severity}
              </Text>
            </View>
            <Text style={styles.anomalyMessage}>{alert.anomaly.message}</Text>
            <Text style={styles.anomalyValue}>
              Valeur: {typeof alert.anomaly.value === 'number' ? 
                alert.anomaly.value.toFixed(2) : alert.anomaly.value}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  const renderAdvancedCharts = () => {
    if (!chartData) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>📊 Analytics Avancés</Text>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Signal RSSI (dBm)</Text>
          {chartData.rssi && (
            <LineChart
              data={chartData.rssi}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                backgroundColor: '#1e293b',
                backgroundGradientFrom: '#1e293b',
                backgroundGradientTo: '#334155',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#3b82f6"
                }
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Niveau de Batterie (%)</Text>
          {chartData.battery && (
            <BarChart
              data={chartData.battery}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                backgroundColor: '#1e293b',
                backgroundGradientFrom: '#1e293b',
                backgroundGradientTo: '#334155',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={styles.chart}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  const renderAIMetrics = () => {
    const totalMembers = members.length;
    const membersWithPredictions = predictions.size;
    const totalAnomalies = Array.from(anomalies.values()).reduce((sum, arr) => sum + arr.length, 0);
    const avgConfidence = Array.from(predictions.values())
      .filter(p => p.predictions?.predictedLocation?.confidence)
      .reduce((sum, p) => sum + p.predictions.predictedLocation.confidence, 0) / 
      (predictions.size || 1);

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>🤖 Métriques IA</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalMembers}</Text>
            <Text style={styles.metricLabel}>Membres Actifs</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{membersWithPredictions}</Text>
            <Text style={styles.metricLabel}>Prédictions IA</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalAnomalies}</Text>
            <Text style={styles.metricLabel}>Anomalies</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{Math.round(avgConfidence * 100)}%</Text>
            <Text style={styles.metricLabel}>Confiance Moyenne</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>🧠 Dashboard Avancé</Text>
        <Text style={styles.subtitle}>Analytics IA et Prédictions</Text>
      </Animated.View>

      {renderAIMetrics()}
      {renderPredictiveInsights()}
      {renderAnomalyAlerts()}
      {renderAdvancedCharts()}
      
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.refreshButton} onPress={analyzeDataWithAI}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>Actualiser l'IA</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  predictionCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  predictionMember: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  predictionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  riskFactors: {
    marginTop: 10,
  },
  riskFactor: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  anomalyCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  anomalyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  anomalyMember: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  anomalySeverity: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  anomalyMessage: {
    fontSize: 14,
    color: '#f87171',
    marginBottom: 5,
  },
  anomalyValue: {
    fontSize: 12,
    color: '#94a3b8',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
