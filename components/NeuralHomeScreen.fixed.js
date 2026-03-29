import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { neuralAI } from '../utils/neural-ai';

const { width, height } = Dimensions.get('window');

// Données enrichies avec IA
const NEURAL_MEMBERS = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Chef de Groupe',
    avatar: 'https://picsum.photos/seed/alexandre/200/200.jpg',
    status: 'online',
    rssi: -50,
    battery: 90,
    zone: 'Zone A - Commandement',
    position: { x: 100, y: 100, z: 0 },
    heartRate: 72,
    stress: 0.2,
    focus: 0.9,
    energy: 0.85,
    activity: 'strategic_planning',
    mood: 'focused',
    score: 98,
    skills: ['Leadership', 'Strategy', 'Neural Coordination'],
    neuralProfile: {
      creativity: 0.8,
      logic: 0.9,
      empathy: 0.7,
      riskTolerance: 0.6,
      adaptability: 0.85
    },
    predictions: {
      nextAction: 'coordinate_team',
      confidence: 0.92,
      emotionalState: 'focused',
      riskLevel: 0.1
    }
  },
  {
    id: '2',
    name: 'Sarah Martin',
    role: 'Agent de Sécurité Neuronal',
    avatar: 'https://picsum.photos/seed/sarah/200/200.jpg',
    status: 'online',
    rssi: -72,
    battery: 60,
    zone: 'Zone B - Périmètre Avancé',
    position: { x: 200, y: 150, z: 0 },
    heartRate: 85,
    stress: 0.4,
    focus: 0.8,
    energy: 0.75,
    activity: 'neural_patrolling',
    mood: 'alert',
    score: 91,
    skills: ['Neural Detection', 'Pattern Recognition', 'AI Analysis'],
    neuralProfile: {
      creativity: 0.6,
      logic: 0.8,
      empathy: 0.5,
      riskTolerance: 0.7,
      adaptability: 0.9
    },
    predictions: {
      nextAction: 'scan_anomaly',
      confidence: 0.87,
      emotionalState: 'alert',
      riskLevel: 0.3
    }
  },
  {
    id: '3',
    name: 'Thomas Bernard',
    role: 'Technicien Quantique',
    avatar: 'https://picsum.photos/seed/thomas/200/200.jpg',
    status: 'warning',
    rssi: -85,
    battery: 30,
    zone: 'Zone C - Laboratoire Quantique',
    position: { x: 150, y: 200, z: 0 },
    heartRate: 95,
    stress: 0.6,
    focus: 0.7,
    energy: 0.4,
    activity: 'quantum_maintenance',
    mood: 'stressed',
    score: 78,
    skills: ['Quantum Computing', 'Neural Networks', 'System Optimization'],
    neuralProfile: {
      creativity: 0.9,
      logic: 0.85,
      empathy: 0.4,
      riskTolerance: 0.8,
      adaptability: 0.7
    },
    predictions: {
      nextAction: 'optimize_system',
      confidence: 0.79,
      emotionalState: 'stressed',
      riskLevel: 0.6
    },
    sos: true
  },
  {
    id: '4',
    name: 'Marie Laurent',
    role: 'Médical IA',
    avatar: 'https://picsum.photos/seed/marie/200/200.jpg',
    status: 'offline',
    rssi: -95,
    battery: 15,
    zone: 'Zone D - Centre Médical Neuronal',
    position: { x: 300, y: 100, z: 0 },
    heartRate: 68,
    stress: 0.1,
    focus: 0.6,
    energy: 0.3,
    activity: 'neural_diagnosis',
    mood: 'calm',
    score: 94,
    skills: ['AI Diagnosis', 'Neural Medicine', 'Predictive Health'],
    neuralProfile: {
      creativity: 0.7,
      logic: 0.9,
      empathy: 0.95,
      riskTolerance: 0.3,
      adaptability: 0.8
    },
    predictions: {
      nextAction: 'diagnose_patient',
      confidence: 0.88,
      emotionalState: 'calm',
      riskLevel: 0.2
    }
  },
  {
    id: '5',
    name: 'Jean-Pierre Rousseau',
    role: 'Coordinateur Logistique IA',
    avatar: 'https://picsum.photos/seed/jeanpierre/200/200.jpg',
    status: 'online',
    rssi: -68,
    battery: 75,
    zone: 'Zone E - Hub Logistique Neuronal',
    position: { x: 250, y: 250, z: 0 },
    heartRate: 70,
    stress: 0.2,
    focus: 0.85,
    energy: 0.8,
    activity: 'neural_coordination',
    mood: 'organized',
    score: 96,
    skills: ['AI Logistics', 'Neural Planning', 'Predictive Distribution'],
    neuralProfile: {
      creativity: 0.5,
      logic: 0.95,
      empathy: 0.6,
      riskTolerance: 0.4,
      adaptability: 0.9
    },
    predictions: {
      nextAction: 'optimize_distribution',
      confidence: 0.94,
      emotionalState: 'organized',
      riskLevel: 0.1
    }
  },
  {
    id: '6',
    name: 'Isabelle Moreau',
    role: 'Communications Neuronales',
    avatar: 'https://picsum.photos/seed/isabelle/200/200.jpg',
    status: 'online',
    rssi: -58,
    battery: 88,
    zone: 'Zone F - Centre de Communication IA',
    position: { x: 180, y: 180, z: 0 },
    heartRate: 75,
    stress: 0.15,
    focus: 0.9,
    energy: 0.9,
    activity: 'neural_broadcasting',
    mood: 'connected',
    score: 97,
    skills: ['Neural Communication', 'AI Translation', 'Quantum Messaging'],
    neuralProfile: {
      creativity: 0.8,
      logic: 0.8,
      empathy: 0.85,
      riskTolerance: 0.5,
      adaptability: 0.95
    },
    predictions: {
      nextAction: 'broadcast_update',
      confidence: 0.96,
      emotionalState: 'connected',
      riskLevel: 0.05
    }
  }
];

export default function NeuralHomeScreen({ navigation, user, onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [neuralInsights, setNeuralInsights] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [clusters, setClusters] = useState([]);
  const [globalMetrics, setGlobalMetrics] = useState({});
  
  // Valeurs animées
  const animatedValues = useRef({
    pulse: new Animated.Value(1),
    shimmer: new Animated.Value(0),
    neural: new Animated.Value(0),
    rotation: new Animated.Value(0),
    scale: new Animated.Value(1)
  }).current;

  // Référence pour les gestes
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        animatedValues.rotation.setValue(dx * 0.01);
        animatedValues.scale.setValue(1 + dy * 0.001);
      },
      onPanResponderRelease: () => {
        Animated.spring(animatedValues.rotation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(animatedValues.scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    // Démarrer les animations neuronales
    startNeuralAnimations();
    
    // Mise à jour du temps
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Analyse neurale initiale
    performNeuralAnalysis();

    // Mises à jour neuronales en temps réel
    const neuralTimer = setInterval(() => {
      updateNeuralData();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(neuralTimer);
    };
  }, []);

  const startNeuralAnimations = () => {
    // Animation de pulse neuronale
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.pulse, {
          toValue: 1.1,
          duration: 2000,
          easing: (t) => Math.sin(t * Math.PI),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.pulse, {
          toValue: 1,
          duration: 2000,
          easing: (t) => Math.sin(t * Math.PI),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de shimmer neuronal
    Animated.loop(
      Animated.timing(animatedValues.shimmer, {
        toValue: 1,
        duration: 3000,
        easing: (t) => t,
        useNativeDriver: true,
      })
    ).start();

    // Animation neurale
    Animated.loop(
      Animated.timing(animatedValues.neural, {
        toValue: 1,
        duration: 4000,
        easing: (t) => Math.sin(t * Math.PI * 2),
        useNativeDriver: true,
      })
    ).start();
  };

  const performNeuralAnalysis = () => {
    // Analyse des clusters comportementaux
    const behavioralClusters = neuralAI.analyzeBehavioralClusters(NEURAL_MEMBERS);
    setClusters(behavioralClusters);

    // Prédictions pour chaque membre
    const memberPredictions = {};
    NEURAL_MEMBERS.forEach(member => {
      const prediction = neuralAI.predictBehavior(member);
      memberPredictions[member.id] = prediction;
    });
    setPredictions(memberPredictions);

    // Métriques globales
    const metrics = calculateGlobalMetrics();
    setGlobalMetrics(metrics);

    // Insights neuronaux
    const insights = generateNeuralInsights(behavioralClusters, memberPredictions);
    setNeuralInsights(insights);
  };

  const updateNeuralData = () => {
    // Mise à jour des données en temps réel avec IA
    NEURAL_MEMBERS.forEach(member => {
      // Simulation de données biométriques réalistes
      member.heartRate = Math.floor(60 + Math.random() * 40);
      member.stress = Math.random() * 0.5;
      member.focus = 0.5 + Math.random() * 0.5;
      member.energy = Math.max(0.1, member.energy - Math.random() * 0.05);
      
      // Mise à jour de la position avec mouvement intelligent
      member.position.x += (Math.random() - 0.5) * 10;
      member.position.y += (Math.random() - 0.5) * 10;
      
      // Mise à jour du RSSI et batterie
      member.rssi = Math.max(-120, Math.min(-30, member.rssi + (Math.random() - 0.5) * 5));
      member.battery = Math.max(0, Math.min(100, member.battery - Math.random() * 0.2));
      
      // Apprentissage neuronal
      if (predictions[member.id]) {
        neuralAI.learn(member.id, member, predictions[member.id]);
      }
    });

    // Recalculer les prédictions
    performNeuralAnalysis();
  };

  const calculateGlobalMetrics = () => {
    const onlineCount = NEURAL_MEMBERS.filter(m => m.status === 'online').length;
    const avgHeartRate = Math.round(NEURAL_MEMBERS.reduce((sum, m) => sum + m.heartRate, 0) / NEURAL_MEMBERS.length);
    const avgStress = NEURAL_MEMBERS.reduce((sum, m) => sum + m.stress, 0) / NEURAL_MEMBERS.length;
    const avgFocus = NEURAL_MEMBERS.reduce((sum, m) => sum + m.focus, 0) / NEURAL_MEMBERS.length;
    const avgEnergy = NEURAL_MEMBERS.reduce((sum, m) => sum + m.energy, 0) / NEURAL_MEMBERS.length;
    const totalScore = Math.round(NEURAL_MEMBERS.reduce((sum, m) => sum + m.score, 0) / NEURAL_MEMBERS.length);
    
    return {
      onlineCount,
      avgHeartRate,
      avgStress,
      avgFocus,
      avgEnergy,
      totalScore,
      neuralEfficiency: calculateNeuralEfficiency(),
      collectiveIntelligence: calculateCollectiveIntelligence(),
      adaptiveCapacity: calculateAdaptiveCapacity()
    };
  };

  const calculateNeuralEfficiency = () => {
    const totalFocus = NEURAL_MEMBERS.reduce((sum, m) => sum + m.focus, 0);
    const totalEnergy = NEURAL_MEMBERS.reduce((sum, m) => sum + m.energy, 0);
    const totalStress = NEURAL_MEMBERS.reduce((sum, m) => sum + m.stress, 0);
    
    return Math.round(((totalFocus + totalEnergy - totalStress) / (NEURAL_MEMBERS.length * 3)) * 100);
  };

  const calculateCollectiveIntelligence = () => {
    const totalCreativity = NEURAL_MEMBERS.reduce((sum, m) => sum + m.neuralProfile.creativity, 0);
    const totalLogic = NEURAL_MEMBERS.reduce((sum, m) => sum + m.neuralProfile.logic, 0);
    const totalEmpathy = NEURAL_MEMBERS.reduce((sum, m) => sum + m.neuralProfile.empathy, 0);
    
    return Math.round(((totalCreativity + totalLogic + totalEmpathy) / (NEURAL_MEMBERS.length * 3)) * 100);
  };

  const calculateAdaptiveCapacity = () => {
    const totalAdaptability = NEURAL_MEMBERS.reduce((sum, m) => sum + m.neuralProfile.adaptability, 0);
    const totalRiskTolerance = NEURAL_MEMBERS.reduce((sum, m) => sum + m.neuralProfile.riskTolerance, 0);
    
    return Math.round(((totalAdaptability + totalRiskTolerance) / (NEURAL_MEMBERS.length * 2)) * 100);
  };

  const generateNeuralInsights = (clusters, predictions) => {
    const insights = [];
    
    // Insight sur les clusters
    if (clusters.length > 0) {
      const highRiskCluster = clusters.find(c => c.riskLevel > 0.7);
      if (highRiskCluster) {
        insights.push({
          type: 'warning',
          title: 'Cluster à Haut Risque Détecté',
          description: `Le cluster ${highRiskCluster.id} présente un risque de ${Math.round(highRiskCluster.riskLevel * 100)}%`,
          action: 'surveillance_augmentee'
        });
      }
    }
    
    // Insight sur les prédictions
    const highRiskMembers = Object.entries(predictions).filter(([id, pred]) => pred.riskLevel > 0.6);
    if (highRiskMembers.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Membres à Risque Élevé',
        description: `${highRiskMembers.length} membre(s) nécessitent une attention particulière`,
        action: 'intervention_immediate'
      });
    }
    
    // Insight sur l'efficacité neurale
    if (globalMetrics.neuralEfficiency < 70) {
      insights.push({
        type: 'info',
        title: 'Efficacité Neurale en Baisse',
        description: `L'efficacité neurale est à ${globalMetrics.neuralEfficiency}%`,
        action: 'optimisation_energetique'
      });
    }
    
    // Insight sur l'intelligence collective
    if (globalMetrics.collectiveIntelligence > 85) {
      insights.push({
        type: 'success',
        title: 'Intelligence Collective Élevée',
        description: `L'intelligence collective atteint ${globalMetrics.collectiveIntelligence}%`,
        action: 'maintien_performance'
      });
    }
    
    return insights;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    performNeuralAnalysis();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleMemberPress = (member) => {
    setSelectedMember(member);
    // Animation de sélection neuronale
    Animated.sequence([
      Animated.timing(animatedValues.neural, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.neural, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getNeuralColor = (value) => {
    if (value > 0.8) return '#10b981';
    if (value > 0.6) return '#3b82f6';
    if (value > 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const renderNeuralMetrics = () => (
    <Animated.View style={[styles.neuralMetricsContainer, { opacity: animatedValues.neural }]}>
      <View style={styles.metricsRow}>
        <Animated.View style={[styles.metricCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Text style={[styles.metricValue, { color: getNeuralColor(globalMetrics.neuralEfficiency / 100) }]}>
            {globalMetrics.neuralEfficiency}%
          </Text>
          <Text style={styles.metricLabel}>Efficacité Neurale</Text>
          <Ionicons name="brain" size={24} color={getNeuralColor(globalMetrics.neuralEfficiency / 100)} />
        </Animated.View>

        <Animated.View style={[styles.metricCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Text style={[styles.metricValue, { color: getNeuralColor(globalMetrics.collectiveIntelligence / 100) }]}>
            {globalMetrics.collectiveIntelligence}%
          </Text>
          <Text style={styles.metricLabel}>Intelligence Collective</Text>
          <Ionicons name="people" size={24} color={getNeuralColor(globalMetrics.collectiveIntelligence / 100)} />
        </Animated.View>
      </View>

      <View style={styles.metricsRow}>
        <Animated.View style={[styles.metricCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Text style={[styles.metricValue, { color: getNeuralColor(globalMetrics.adaptiveCapacity / 100) }]}>
            {globalMetrics.adaptiveCapacity}%
          </Text>
          <Text style={styles.metricLabel}>Capacité Adaptative</Text>
          <Ionicons name="sync" size={24} color={getNeuralColor(globalMetrics.adaptiveCapacity / 100)} />
        </Animated.View>

        <Animated.View style={[styles.metricCard, { transform: [{ scale: animatedValues.pulse }] }]}>
          <Text style={[styles.metricValue, { color: getNeuralColor(globalMetrics.totalScore / 100) }]}>
            {globalMetrics.totalScore}
          </Text>
          <Text style={styles.metricLabel}>Score Global</Text>
          <Ionicons name="analytics" size={24} color={getNeuralColor(globalMetrics.totalScore / 100)} />
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderNeuralInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.insightsTitle}>🧠 Insights Neuronaux</Text>
      {neuralInsights.map((insight, index) => (
        <Animated.View
          key={index}
          style={[
            styles.insightCard,
            {
              opacity: animatedValues.shimmer,
              transform: [{ translateY: animatedValues.neural.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0]
              })]
            }
          ]}
        >
          <View style={styles.insightHeader}>
            <Ionicons 
              name={
                insight.type === 'warning' ? 'warning' :
                insight.type === 'alert' ? 'alert' :
                insight.type === 'success' ? 'checkmark-circle' : 'information-circle'
              } 
              size={20} 
              color={
                insight.type === 'warning' ? '#f59e0b' :
                insight.type === 'alert' ? '#ef4444' :
                insight.type === 'success' ? '#10b981' : '#3b82f6'
              } 
            />
            <Text style={[styles.insightTitle, { color: 'white' }]}>{insight.title}</Text>
          </View>
          <Text style={styles.insightDescription}>{insight.description}</Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>{insight.action}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderNeuralMember = (member, index) => {
    const prediction = predictions[member.id];
    const delay = index * 100;

    return (
      <Animated.View
        key={member.id}
        style={[
          styles.neuralMemberCard,
          {
            opacity: animatedValues.shimmer,
            transform: [
              { translateY: animatedValues.neural },
              { scale: animatedValues.pulse }
            ]
          }
        ]}
      >
        {/* Header neuronal */}
        <View style={styles.neuralMemberHeader}>
          <View style={styles.neuralAvatarContainer}>
            <Image source={{ uri: member.avatar }} style={styles.neuralAvatar} />
            <Animated.View
              style={[
                styles.neuralStatusRing,
                {
                  borderColor: member.status === 'online' ? '#10b981' : '#64748b',
                  transform: [{ scale: animatedValues.pulse }]
                }
              ]}
            />
            <View style={styles.neuralMoodIndicator}>
              <Text style={styles.neuralMoodText}>
                {member.mood === 'focused' && '🎯'}
                {member.mood === 'alert' && '⚠️'}
                {member.mood === 'stressed' && '😰'}
                {member.mood === 'calm' && '😌'}
                {member.mood === 'organized' && '📋'}
                {member.mood === 'connected' && '🔗'}
              </Text>
            </View>
          </View>

          <View style={styles.neuralMemberInfo}>
            <Text style={styles.neuralMemberName}>{member.name}</Text>
            <Text style={styles.neuralMemberRole}>{member.role}</Text>
            <View style={styles.neuralSkillsContainer}>
              {member.skills.slice(0, 2).map((skill, i) => (
                <View key={i} style={styles.neuralSkillTag}>
                  <Text style={styles.neuralSkillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.neuralScoreContainer}>
            <Text style={[styles.neuralScore, { color: getNeuralColor(member.score / 100) }]}>
              {member.score}
            </Text>
            <Text style={styles.neuralScoreLabel}>Score</Text>
          </View>
        </View>

        {/* Biométries neuronales */}
        <View style={styles.neuralBiometricsContainer}>
          <View style={styles.biometricRow}>
            <View style={styles.biometricItem}>
              <Ionicons name="heart" size={16} color="#ef4444" />
              <Text style={styles.biometricValue}>{member.heartRate}</Text>
              <Text style={styles.biometricLabel}>BPM</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="pulse" size={16} color="#f59e0b" />
              <Text style={styles.biometricValue}>{Math.round(member.stress * 100)}%</Text>
              <Text style={styles.biometricLabel}>Stress</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="eye" size={16} color="#3b82f6" />
              <Text style={styles.biometricValue}>{Math.round(member.focus * 100)}%</Text>
              <Text style={styles.biometricLabel}>Focus</Text>
            </View>
            <View style={styles.biometricItem}>
              <Ionicons name="battery-charging" size={16} color="#10b981" />
              <Text style={styles.biometricValue}>{Math.round(member.energy * 100)}%</Text>
              <Text style={styles.biometricLabel}>Energy</Text>
            </View>
          </View>
        </View>

        {/* Profil neuronal */}
        <View style={styles.neuralProfileContainer}>
          <Text style={styles.neuralProfileTitle}>🧠 Profil Neuronal</Text>
          <View style={styles.neuralProfileBars}>
            {Object.entries(member.neuralProfile).map(([key, value]) => (
              <View key={key} style={styles.profileBarContainer}>
                <Text style={styles.profileBarLabel}>
                  {key === 'creativity' && 'Créativité'}
                  {key === 'logic' && 'Logique'}
                  {key === 'empathy' && 'Empathie'}
                  {key === 'riskTolerance' && 'Tolérance'}
                  {key === 'adaptability' && 'Adaptabilité'}
                </Text>
                <View style={styles.profileBarBackground}>
                  <Animated.View
                    style={[
                      styles.profileBarFill,
                      {
                        width: `${value * 100}%`,
                        backgroundColor: getNeuralColor(value)
                      }
                    ]}
                  />
                </View>
                <Text style={styles.profileBarValue}>{Math.round(value * 100)}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Prédiction IA */}
        {prediction && (
          <View style={styles.neuralPredictionContainer}>
            <Text style={styles.neuralPredictionTitle}>🔮 Prédiction IA</Text>
            <Text style={styles.neuralPredictionAction}>{prediction.nextAction}</Text>
            <View style={styles.neuralPredictionMeta}>
              <Text style={styles.neuralPredictionConfidence}>
                Confiance: {Math.round(prediction.confidence * 100)}%
              </Text>
              <Text style={[
                styles.neuralPredictionRisk,
                { color: getNeuralColor(1 - prediction.riskLevel) }
              ]}>
                Risque: {Math.round(prediction.riskLevel * 100)}%
              </Text>
            </View>
          </View>
        )}

        {/* Actions neuronales */}
        <View style={styles.neuralActionsContainer}>
          <TouchableOpacity style={[styles.neuralActionButton, { backgroundColor: '#3b82f6' }]}>
            <Ionicons name="call" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.neuralActionButton, { backgroundColor: '#8b5cf6' }]}>
            <Ionicons name="chatbubble" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.neuralActionButton, { backgroundColor: '#10b981' }]}>
            <Ionicons name="location" size={16} color="white" />
          </TouchableOpacity>
          {member.sos && (
            <TouchableOpacity style={[styles.neuralActionButton, { backgroundColor: '#ef4444' }]}>
              <Ionicons name="warning" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Background neuronal */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155', '#475569', '#64748b']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Effet de grille neuronale */}
      <Animated.View style={[styles.neuralGrid, { opacity: animatedValues.neural }]} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        {...panResponder.panHandlers}
      >
        {/* Header neuronal */}
        <View style={styles.neuralHeader}>
          <Text style={styles.neuralGreeting}>
            🧠 Interface Neurale Avancée
          </Text>
          <Text style={styles.neuralTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.neuralUser}>Bienvenue, {user?.name || 'Administrateur'}</Text>
        </View>

        {/* Métriques neuronales */}
        {renderNeuralMetrics()}

        {/* Insights neuronaux */}
        {renderNeuralInsights()}

        {/* Membres neuronaux */}
        <View style={styles.neuralMembersContainer}>
          <Text style={styles.neuralMembersTitle}>🚀 Équipe Neurale Avancée</Text>
          {NEURAL_MEMBERS.map((member, index) => renderNeuralMember(member, index))}
        </View>

        {/* Contrôles flottants */}
        <View style={styles.neuralFloatingControls}>
          <TouchableOpacity
            style={[styles.neuralFloatingButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="analytics" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.neuralFloatingButton, { backgroundColor: '#ef4444' }]}
            onPress={onLogout}
          >
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  neuralGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  neuralHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  neuralGreeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 10,
    textAlign: 'center',
  },
  neuralTime: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 5,
  },
  neuralUser: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '600',
  },
  neuralMetricsContainer: {
    marginBottom: 30,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginHorizontal: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },
  insightsContainer: {
    marginBottom: 30,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  insightDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 15,
    lineHeight: 20,
  },
  insightAction: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  neuralMembersContainer: {
    marginBottom: 30,
  },
  neuralMembersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 20,
  },
  neuralMemberCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  neuralMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  neuralAvatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  neuralAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  neuralStatusRing: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  neuralMoodIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 10,
    padding: 2,
  },
  neuralMoodText: {
    fontSize: 12,
  },
  neuralMemberInfo: {
    flex: 1,
  },
  neuralMemberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  neuralMemberRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  neuralSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  neuralSkillTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  neuralSkillText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '600',
  },
  neuralScoreContainer: {
    alignItems: 'center',
  },
  neuralScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  neuralScoreLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  neuralBiometricsContainer: {
    marginBottom: 15,
  },
  biometricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  biometricItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 10,
    flex: 1,
    marginHorizontal: 2,
  },
  biometricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 2,
  },
  biometricLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  neuralProfileContainer: {
    marginBottom: 15,
  },
  neuralProfileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 10,
  },
  neuralProfileBars: {
    gap: 8,
  },
  profileBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBarLabel: {
    fontSize: 12,
    color: '#94a3b8',
    width: 80,
  },
  profileBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  profileBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  profileBarValue: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  neuralPredictionContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  neuralPredictionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  neuralPredictionAction: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  neuralPredictionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  neuralPredictionConfidence: {
    fontSize: 12,
    color: '#94a3b8',
  },
  neuralPredictionRisk: {
    fontSize: 12,
    fontWeight: '600',
  },
  neuralActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  neuralActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  neuralFloatingControls: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    gap: 15,
  },
  neuralFloatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
});
