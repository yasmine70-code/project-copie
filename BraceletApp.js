import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import io from 'socket.io-client';

export default function BraceletApp() {
  const [rssi, setRssi] = useState(-50);
  const [battery, setBattery] = useState(85);
  const [connected, setConnected] = useState(false);
  const [deviceId] = useState('BRACELET_' + Math.random().toString(36).substr(2, 9));
  const [lastScan, setLastScan] = useState(null);

  // Configuration - MODIFIEZ CETTE IP
  const SERVER_IP = '10.246.17.10'; // Changez avec votre IP locale
  const SERVER_PORT = '3000';

  // Connexion WebSocket au backend
  useEffect(() => {
    const socket = io(`http://${SERVER_IP}:${SERVER_PORT}`);
    
    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ Connecté au backend PC');
      Alert.alert('Connexion', 'Connecté au serveur avec succès !');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Déconnecté du backend');
      Alert.alert('Déconnexion', 'Perte de connexion avec le serveur');
    });

    // Envoyer données périodiquement
    const interval = setInterval(() => {
      if (connected) {
        sendBraceletData(socket);
      }
    }, 5000); // Toutes les 5 secondes

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [connected]);

  // Scanner WiFi et mesurer RSSI
  const scanRSSI = async () => {
    try {
      // Simulation de scan RSSI avec variations réalistes
      const baseRSSI = -50;
      const variation = (Math.random() - 0.5) * 20; // -10 à +10
      const newRSSI = Math.round(baseRSSI + variation);
      
      setRssi(newRSSI);
      setLastScan(new Date().toLocaleTimeString());
      
      // Simuler décharge batterie très lente
      const batteryDrain = Math.random() * 0.1;
      setBattery(prev => Math.max(0, prev - batteryDrain));
      
      console.log(`📡 RSSI: ${newRSSI} dBm`);
      
    } catch (error) {
      console.error('❌ Erreur scan RSSI:', error);
      Alert.alert('Erreur', 'Impossible de scanner le RSSI');
    }
  };

  // Envoyer données au backend
  const sendBraceletData = (socket) => {
    const data = {
      deviceId: deviceId,
      rssi: rssi,
      battery: Math.round(battery),
      timestamp: new Date().toISOString(),
      sos: false,
      location: {
        x: Math.round(Math.random() * 100), // Simulation position
        y: Math.round(Math.random() * 100)
      }
    };

    socket.emit('bracelet_data', data);
    console.log('📤 Données envoyées:', data);
  };

  // Simulation bouton SOS
  const sendSOS = () => {
    if (connected) {
      const socket = io(`http://${SERVER_IP}:${SERVER_PORT}`);
      socket.emit('sos_alert', {
        deviceId: deviceId,
        timestamp: new Date().toISOString(),
        location: { 
          x: Math.round(Math.random() * 100), 
          y: Math.round(Math.random() * 100) 
        }
      });
      
      Alert.alert('🆘 SOS', 'Alerte SOS envoyée au chef de groupe !', [
        { text: 'OK', style: 'default' }
      ]);
    } else {
      Alert.alert('Erreur', 'Non connecté au serveur');
    }
  };

  // Fonctions utilitaires
  const getRSSIColor = (rssi) => {
    if (rssi > -60) return '#10b981';  // Vert - Excellent
    if (rssi > -75) return '#f59e0b';  // Orange - Moyen
    return '#ef4444';                    // Rouge - Faible
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return '#10b981';
    if (battery > 30) return '#f59e0b';
    return '#ef4444';
  };

  const getRSSIStatus = (rssi) => {
    if (rssi > -60) return 'Excellent';
    if (rssi > -75) return 'Moyen';
    return 'Faible';
  };

  const getDistanceEstimate = (rssi) => {
    // Formule simplifiée pour estimer la distance
    const txPower = -50; // Puissance d'émission typique
    const n = 3.0; // Environnement intérieur
    
    if (rssi === 0) return 0;
    
    const distance = Math.pow(10, (txPower - rssi) / (10 * n));
    return Math.round(distance);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📱 Bracelet RSSI Prototype</Text>
        <Text style={styles.subtitle}>Test de communication avec le backend</Text>
      </View>

      {/* Status de connexion */}
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>
          Serveur: {connected ? '✅ Connecté' : '❌ Déconnecté'}
        </Text>
        <Text style={styles.serverInfo}>
          {SERVER_IP}:{SERVER_PORT}
        </Text>
      </View>

      {/* Device ID */}
      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>🆔 ID du Bracelet:</Text>
        <Text style={styles.dataValue}>{deviceId}</Text>
      </View>

      {/* RSSI */}
      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>📡 RSSI:</Text>
        <Text style={[styles.dataValue, { color: getRSSIColor(rssi) }]}>
          {rssi} dBm
        </Text>
        <Text style={[styles.statusText, { color: getRSSIColor(rssi) }]}>
          {getRSSIStatus(rssi)} - ~{getDistanceEstimate(rssi)}m
        </Text>
      </View>

      {/* Batterie */}
      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>🔋 Batterie:</Text>
        <Text style={[styles.dataValue, { color: getBatteryColor(battery) }]}>
          {Math.round(battery)}%
        </Text>
        <View style={styles.batteryBar}>
          <View style={[
            styles.batteryFill, 
            { 
              width: `${battery}%`,
              backgroundColor: getBatteryColor(battery)
            }
          ]} />
        </View>
      </View>

      {/* Dernier scan */}
      {lastScan && (
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>⏰ Dernier scan:</Text>
          <Text style={styles.dataValue}>{lastScan}</Text>
        </View>
      )}

      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={scanRSSI}
        >
          <Text style={styles.buttonText}>📡 Scanner RSSI</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.sosButton}
          onPress={sendSOS}
        >
          <Text style={styles.sosButtonText}>🆘 SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Assurez-vous que le backend PC est démarré
        </Text>
        <Text style={styles.instructionsText}>
          2. Vérifiez l'IP du serveur: {SERVER_IP}
        </Text>
        <Text style={styles.instructionsText}>
          3. Appuyez sur "Scanner RSSI" pour envoyer des données
        </Text>
        <Text style={styles.instructionsText}>
          4. Les données sont envoyées toutes les 5 secondes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 5,
  },
  serverInfo: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  dataCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  dataLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  batteryBar: {
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sosButton: {
    backgroundColor: '#ef4444',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
    lineHeight: 16,
  },
});
