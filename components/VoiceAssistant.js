import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VoiceAssistant({ members, onCommand, isActive, setIsActive }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      startAnimations();
      generateSuggestions();
    } else {
      stopAnimations();
    }
  }, [isListening]);

  const startAnimations = () => {
    // Animation de pulse pour le bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de vagues sonores
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de fade pour le transcript
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const stopAnimations = () => {
    pulseAnim.setValue(1);
    waveAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('Écoute en cours...');
    
    // Simulation de reconnaissance vocale
    simulateVoiceRecognition();
  };

  const stopListening = () => {
    setIsListening(false);
    setIsActive(false);
    
    if (transcript && transcript !== 'Écoute en cours...') {
      processCommand(transcript);
    }
  };

  const simulateVoiceRecognition = () => {
    // Simuler la reconnaissance vocale avec des commandes prédéfinies
    const commands = [
      'Où est Jean-Pierre',
      'Montre-moi tous les membres',
      'Alerte tous les membres',
      'Batterie faible',
      'Vérifier le signal',
      'Mode urgence',
      'Carte thermique',
      'Prédire les mouvements',
      'Analyser les risques',
      'Activer le mode X-Ray'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < commands.length && isListening) {
        setTranscript(commands[index]);
        index++;
      } else {
        clearInterval(interval);
        if (isListening) {
          setTranscript('Commande détectée: ' + commands[commands.length - 1]);
        }
      }
    }, 2000);
  };

  const processCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    let action = null;

    // Commandes de localisation
    if (lowerCommand.includes('où est') || lowerCommand.includes('localiser')) {
      const memberName = extractMemberName(command);
      if (memberName) {
        const member = members.find(m => 
          m.name.toLowerCase().includes(memberName.toLowerCase())
        );
        if (member) {
          response = `${member.name} est à ${Math.round(member.distance)} mètres, RSSI: ${member.rssi} dBm`;
          action = { type: 'LOCATE_MEMBER', memberId: member.id };
        } else {
          response = `Membre ${memberName} non trouvé`;
        }
      }
    }
    
    // Commandes de liste
    else if (lowerCommand.includes('montre') || lowerCommand.includes('liste')) {
      response = `Affichage des ${members.length} membres actifs`;
      action = { type: 'SHOW_ALL_MEMBERS' };
    }
    
    // Commandes d'alerte
    else if (lowerCommand.includes('alerte') || lowerCommand.includes('urgence')) {
      response = 'Alerte générale envoyée à tous les membres';
      action = { type: 'SEND_ALERT', alertType: 'GENERAL' };
    }
    
    // Commandes de batterie
    else if (lowerCommand.includes('batterie')) {
      const lowBatteryMembers = members.filter(m => m.battery < 30);
      if (lowBatteryMembers.length > 0) {
        response = `${lowBatteryMembers.length} membres ont une batterie faible`;
        action = { type: 'SHOW_LOW_BATTERY' };
      } else {
        response = 'Tous les membres ont une batterie correcte';
      }
    }
    
    // Commandes de signal
    else if (lowerCommand.includes('signal') || lowerCommand.includes('rssi')) {
      const weakSignalMembers = members.filter(m => m.rssi < -70);
      if (weakSignalMembers.length > 0) {
        response = `${weakSignalMembers.length} membres ont un signal faible`;
        action = { type: 'SHOW_WEAK_SIGNAL' };
      } else {
        response = 'Tous les membres ont un bon signal';
      }
    }
    
    // Commandes de mode
    else if (lowerCommand.includes('thermique')) {
      response = 'Activation du mode vue thermique';
      action = { type: 'ACTIVATE_THERMAL_VIEW' };
    }
    else if (lowerCommand.includes('x-ray') || lowerCommand.includes('xray')) {
      response = 'Activation du mode X-Ray';
      action = { type: 'ACTIVATE_XRAY_VIEW' };
    }
    else if (lowerCommand.includes('carte') || lowerCommand.includes('map')) {
      response = 'Affichage de la carte 3D';
      action = { type: 'SHOW_3D_MAP' };
    }
    
    // Commandes IA
    else if (lowerCommand.includes('prédire') || lowerCommand.includes('prévoir')) {
      response = 'Lancement de la prédiction de mouvements';
      action = { type: 'PREDICT_MOVEMENTS' };
    }
    else if (lowerCommand.includes('analyser') || lowerCommand.includes('risque')) {
      response = 'Analyse des risques en cours';
      action = { type: 'ANALYZE_RISKS' };
    }
    
    // Commande par défaut
    else {
      response = 'Commande non reconnue. Essayez: "Où est [nom]" ou "Montre tous les membres"';
    }

    setLastCommand(command);
    setTranscript(response);
    
    if (action) {
      onCommand(action);
    }
    
    // Vibration pour confirmer
    Vibration.vibrate(200);
  };

  const extractMemberName = (command) => {
    const words = command.toLowerCase().split(' ');
    const memberNames = members.map(m => m.name.toLowerCase());
    
    for (const word of words) {
      const foundName = memberNames.find(name => name.includes(word));
      if (foundName) {
        return members.find(m => m.name.toLowerCase() === foundName)?.name;
      }
    }
    
    return null;
  };

  const generateSuggestions = () => {
    const suggestions = [
      'Où est [nom du membre]?',
      'Montre tous les membres',
      'Alerte générale',
      'Vérifier la batterie',
      'Mode thermique',
      'Prédire les mouvements'
    ];
    
    setSuggestions(suggestions);
  };

  const renderVoiceWaves = () => {
    if (!isListening) return null;

    return (
      <View style={styles.wavesContainer}>
        {[1, 2, 3].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.wave,
              {
                opacity: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 0.2],
                })
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderSuggestions = () => {
    if (!isListening || suggestions.length === 0) return null;

    return (
      <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
        <Text style={styles.suggestionsTitle}>Suggestions:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => {
              setTranscript(suggestion);
              processCommand(suggestion);
              stopListening();
            }}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bouton d'activation vocale */}
      <TouchableOpacity
        style={[
          styles.voiceButton,
          isListening && styles.voiceButtonActive,
          { opacity: pulseAnim }
        ]}
        onPress={isListening ? stopListening : startListening}
      >
        <Ionicons 
          name={isListening ? 'stop' : 'mic'} 
          size={32} 
          color="white" 
        />
        <Text style={styles.voiceButtonText}>
          {isListening ? 'Arrêter' : 'Assistant IA'}
        </Text>
      </TouchableOpacity>

      {/* Vagues sonores animées */}
      {renderVoiceWaves()}

      {/* Transcript */}
      <Animated.View style={[styles.transcriptContainer, { opacity: fadeAnim }]}>
        <Text style={styles.transcriptText}>{transcript}</Text>
      </Animated.View>

      {/* Dernière commande */}
      {lastCommand ? (
        <View style={styles.lastCommandContainer}>
          <Text style={styles.lastCommandLabel}>Dernière commande:</Text>
          <Text style={styles.lastCommandText}>{lastCommand}</Text>
        </View>
      ) : null}

      {/* Suggestions */}
      {renderSuggestions()}

      {/* Instructions */}
      {!isListening && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>🎙️ Commandes vocales:</Text>
          <Text style={styles.instructionText}>• "Où est Jean?"</Text>
          <Text style={styles.instructionText}>• "Montre tous les membres"</Text>
          <Text style={styles.instructionText}>• "Alerte générale"</Text>
          <Text style={styles.instructionText}>• "Mode thermique"</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  voiceButton: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  wavesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    height: 60,
  },
  wave: {
    width: 8,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  transcriptContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    minHeight: 60,
    justifyContent: 'center',
  },
  transcriptText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lastCommandContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  lastCommandLabel: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastCommandText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  suggestionsTitle: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestionItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
});
