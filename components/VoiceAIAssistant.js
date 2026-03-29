import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AdvancedAnimations, createAnimatedValues } from '../utils/advanced-animations';
import { themeManager, useTheme, createDynamicStyles } from '../utils/advanced-themes';

const { width, height } = Dimensions.get('window');

// Commandes vocales avancées
const VOICE_COMMANDS = {
  // Commandes de localisation
  locate: {
    patterns: ['où est', 'localise', 'trouve', 'où se trouve', 'position de'],
    action: 'locate',
    description: 'Localiser un membre'
  },
  
  // Commandes de monitoring
  status: {
    patterns: ['statut', 'comment va', 'état de', 'situation de'],
    action: 'status',
    description: 'Vérifier le statut'
  },
  
  // Commandes d'alerte
  alert: {
    patterns: ['alerte', 'urgence', 'sos', 'aide', 'problème'],
    action: 'alert',
    description: 'Envoyer une alerte'
  },
  
  // Commandes de monitoring global
  monitoring: {
    patterns: ['monitoring', 'surveillance', 'vérifie tout', 'état général'],
    action: 'monitoring',
    description: 'Monitoring global'
  },
  
  // Commandes de communication
  communicate: {
    patterns: ['appelle', 'contacte', 'message', 'communique avec'],
    action: 'communicate',
    description: 'Communiquer'
  },
  
  // Commandes de navigation
  navigate: {
    patterns: ['navigate vers', 'va à', 'ouvre', 'affiche'],
    action: 'navigate',
    description: 'Navigation'
  },
  
  // Commandes d'analyse
  analyze: {
    patterns: ['analyse', 'prédit', 'évalue', 'calcule'],
    action: 'analyze',
    description: 'Analyse avancée'
  },
  
  // Commandes de sécurité
  security: {
    patterns: ['sécurité', 'protège', 'sécurise', 'verrouille'],
    action: 'security',
    description: 'Actions de sécurité'
  }
};

// Réponses contextuelles
const AI_RESPONSES = {
  welcome: [
    "Bonjour! Je suis votre assistant IA. Comment puis-je vous aider?",
    "Bonjour! Je suis prêt à vous assister. Que souhaitez-vous faire?",
    "Bonjour! Assistant IA à votre service. Commandes vocales disponibles!"
  ],
  locate: [
    "Je localise {member} pour vous...",
    "Recherche de {member} en cours...",
    "Position de {member} en cours de détection..."
  ],
  status: [
    "Je vérifie le statut de tous les membres...",
    "Analyse de l'état du système en cours...",
    "Monitoring global activé..."
  ],
  alert: [
    "Alerte envoyée! Intervention immédiate requise.",
    "Urgence déclenchée! Équipes prévenues.",
    "Signal d'urgence transmis à tous les membres."
  ],
  monitoring: [
    "Monitoring global activé. Tous les paramètres surveillés.",
    "Surveillance complète en cours. Toutes les métriques analysées.",
    "État général du système en évaluation permanente."
  ],
  communicate: [
    "Communication établie avec {member}...",
    "Appel en cours vers {member}...",
    "Message envoyé à {member}..."
  ],
  navigate: [
    "Navigation vers {destination}...",
    "Ouverture de {destination} en cours...",
    "Changement vers {destination}..."
  ],
  analyze: [
    "Analyse IA en cours. Prédictions générées...",
    "Évaluation avancée des données en cours...",
    "Calculs prédictifs activés..."
  ],
  security: [
    "Protocoles de sécurité activés. Système protégé.",
    "Mode sécurité maximum activé. Toutes les menaces surveillées.",
    "Verrouillage intelligent activé. Accès sécurisé."
  ],
  error: [
    "Je n'ai pas compris. Pouvez-vous répéter?",
    "Commande non reconnue. Essayez autrement.",
    "Je n'ai pas saisi. Reformulez votre demande."
  ],
  processing: [
    "Traitement en cours...",
    "Analyse de votre demande...",
    "Exécution de la commande..."
  ]
};

export default function VoiceAIAssistant({ members, onCommand, isActive, setIsActive }) {
  const theme = useTheme();
  const dynamicStyles = createDynamicStyles(theme);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [volume, setVolume] = useState(0);
  const [confidence, setConfidence] = useState(0);
  
  // Valeurs animées
  const animatedValues = useRef(createAnimatedValues()).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const voiceWaveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Démarrer les animations de l'assistant vocal
    AdvancedAnimations.createPulse(pulseAnimation, 1.1, 1500);
    AdvancedAnimations.createWave(waveAnimation, 3000);
    AdvancedAnimations.createNeon(animatedValues.neon);
    
    // Animation d'ondes vocales
    if (isListening) {
      AdvancedAnimations.createLoading(voiceWaveAnimation, 1000);
    }
  }, [isListening]);

  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    setIsListening(true);
    setCurrentTranscript('');
    setSuggestions([
      "Où est Alexandre?",
      "Statut de l'équipe",
      "Alerte d'urgence",
      "Monitoring global"
    ]);
    
    // Simulation de reconnaissance vocale
    setTimeout(() => {
      simulateVoiceRecognition();
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
    setCurrentTranscript('');
    setSuggestions([]);
  };

  const simulateVoiceRecognition = () => {
    // Simulation de transcription vocale
    const commands = [
      "Où est Alexandre Dubois?",
      "Quel est le statut de l'équipe?",
      "Envoie une alerte d'urgence",
      "Monitoring global du système",
      "Appelle Sarah Martin",
      "Analyse les prédictions",
      "Active la sécurité maximale"
    ];
    
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    
    // Animation de transcription
    let transcript = '';
    const words = randomCommand.split(' ');
    
    words.forEach((word, index) => {
      setTimeout(() => {
        transcript += (index > 0 ? ' ' : '') + word;
        setCurrentTranscript(transcript);
        
        if (index === words.length - 1) {
          // Transcription terminée, traiter la commande
          setTimeout(() => {
            processVoiceCommand(randomCommand);
          }, 500);
        }
      }, 300 * (index + 1));
    });
  };

  const processVoiceCommand = (command) => {
    setIsProcessing(true);
    setIsListening(false);
    
    // Détecter le type de commande
    const detectedCommand = detectCommandType(command);
    
    if (detectedCommand) {
      executeCommand(detectedCommand, command);
    } else {
      // Commande non reconnue
      handleErrorResponse();
    }
  };

  const detectCommandType = (command) => {
    const lowerCommand = command.toLowerCase();
    
    for (const [commandType, config] of Object.entries(VOICE_COMMANDS)) {
      for (const pattern of config.patterns) {
        if (lowerCommand.includes(pattern)) {
          return { type: commandType, config, pattern };
        }
      }
    }
    
    return null;
  };

  const executeCommand = (detectedCommand, fullCommand) => {
    const { type, config } = detectedCommand;
    
    // Réponse contextuelle
    let response = getRandomResponse(type);
    
    // Extraire les entités (noms, destinations)
    const entities = extractEntities(fullCommand);
    
    // Personnaliser la réponse
    if (entities.member) {
      response = response.replace('{member}', entities.member);
    }
    if (entities.destination) {
      response = response.replace('{destination}', entities.destination);
    }
    
    setLastResponse(response);
    
    // Notifier le composant parent
    setTimeout(() => {
      onCommand({
        type,
        command: fullCommand,
        entities,
        confidence: 0.85 + Math.random() * 0.15,
        timestamp: new Date()
      });
      
      setIsProcessing(false);
      setLastResponse(response + " ✅");
    }, 2000);
  };

  const handleErrorResponse = () => {
    const response = getRandomResponse('error');
    setLastResponse(response);
    setIsProcessing(false);
    
    // Suggestions de correction
    setSuggestions([
      "Essayez: 'Où est [nom du membre]'",
      "Essayez: 'Statut de l'équipe'",
      "Essayez: 'Alerte d'urgence'",
      "Essayez: 'Monitoring global'"
    ]);
  };

  const extractEntities = (command) => {
    const entities = {};
    
    // Extraire les noms de membres
    const memberNames = ['Alexandre Dubois', 'Sarah Martin', 'Thomas Bernard', 'Marie Laurent', 'Jean-Pierre Rousseau', 'Isabelle Moreau'];
    const firstNames = ['Alexandre', 'Sarah', 'Thomas', 'Marie', 'Jean-Pierre', 'Isabelle'];
    
    for (const name of memberNames) {
      if (command.toLowerCase().includes(name.toLowerCase())) {
        entities.member = name;
        break;
      }
    }
    
    for (const name of firstNames) {
      if (command.toLowerCase().includes(name.toLowerCase())) {
        entities.member = name;
        break;
      }
    }
    
    // Extraire les destinations
    const destinations = ['dashboard', 'home', 'profil', 'settings', 'analytics'];
    for (const dest of destinations) {
      if (command.toLowerCase().includes(dest)) {
        entities.destination = dest;
        break;
      }
    }
    
    return entities;
  };

  const getRandomResponse = (type) => {
    const responses = AI_RESPONSES[type];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderVoiceWaves = () => {
    if (!isListening) return null;
    
    return (
      <View style={styles.voiceWavesContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.voiceWave,
              {
                transform: [
                  {
                    scale: voiceWaveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1 + index * 0.3],
                    })
                  }
                ]
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;
    
    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Suggestions:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => {
              setCurrentTranscript(suggestion);
              processVoiceCommand(suggestion);
            }}
          >
            <Ionicons name="mic" size={16} color={theme.colors.neon} />
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary[0]} />
      
      {/* Background */}
      <LinearGradient
        colors={theme.background.primary}
        style={dynamicStyles.backgroundGradient}
        start={theme.background.gradient.start}
        end={theme.background.gradient.end}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.neon }]}>
          🎙️ Assistant IA Vocal
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsActive(false)}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Interface principale */}
      <View style={styles.mainContainer}>
        {/* Visualisation vocale */}
        <Animated.View
          style={[
            styles.voiceVisualization,
            {
              transform: [{ scale: pulseAnimation }]
            }
          ]}
        >
          {isListening && renderVoiceWaves()}
          
          <TouchableOpacity
            style={[
              styles.voiceButton,
              {
                backgroundColor: isListening ? theme.colors.error : theme.colors.primary,
                transform: [{ scale: animatedValues.pulse }]
              }
            ]}
            onPress={isListening ? stopListening : startListening}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isListening ? 'stop' : 'mic'}
              size={32}
              color="white"
            />
          </TouchableOpacity>
          
          {isListening && (
            <Animated.Text
              style={[
                styles.listeningText,
                { opacity: waveAnimation }
              ]}
            >
              Écoute en cours...
            </Animated.Text>
          )}
          
          {isProcessing && (
            <Animated.Text
              style={[
                styles.processingText,
                { opacity: animatedValues.neon }
              ]}
            >
              Traitement...
            </Animated.Text>
          )}
        </Animated.View>

        {/* Transcription */}
        {currentTranscript && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Transcription:</Text>
            <Text style={styles.transcriptText}>{currentTranscript}</Text>
          </View>
        )}

        {/* Réponse de l'IA */}
        {lastResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Assistant IA:</Text>
            <Text style={styles.responseText}>{lastResponse}</Text>
          </View>
        )}

        {/* Suggestions */}
        {renderSuggestions()}

        {/* Commandes disponibles */}
        <View style={styles.commandsContainer}>
          <Text style={[styles.commandsTitle, { color: theme.colors.neon }]}>
            📋 Commandes Disponibles
          </Text>
          {Object.entries(VOICE_COMMANDS).map(([key, config]) => (
            <View key={key} style={styles.commandItem}>
              <Text style={styles.commandType}>{key.toUpperCase()}</Text>
              <Text style={styles.commandDescription}>{config.description}</Text>
              <Text style={styles.commandPatterns}>
                {config.patterns.slice(0, 3).join(', ')}...
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  voiceVisualization: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  voiceWavesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceWave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 10,
  },
  listeningText: {
    marginTop: 20,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '600',
  },
  transcriptContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  transcriptLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  transcriptText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  responseContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  responseLabel: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 8,
    fontWeight: '600',
  },
  responseText: {
    fontSize: 16,
    color: '#10b981',
    lineHeight: 24,
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 10,
    flex: 1,
  },
  commandsContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  commandsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  commandItem: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  commandType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  commandDescription: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  commandPatterns: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
});
