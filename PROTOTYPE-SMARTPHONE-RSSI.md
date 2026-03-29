# 📱 **PROTOTYPE RSSI - SMARTPHONE + PC (AVANT ESP32)**

## 📅 **Date**: 13 Mars 2026
## 👤 **Développeur**: Yasmine
## 🎯 **Objectif**: Tester RSSI et système complet avec smartphone/PC

---

## 🎯 **CONCEPT**

### 📱 **Utiliser votre Smartphone comme "Bracelet"**
- Le smartphone **émule un bracelet ESP32**
- Envoie des **données RSSI simulées** au backend
- Permet de tester **toute la chaîne** sans matériel

### 🖥️ **Votre PC comme "Chef de Groupe"**
- Héberge le **backend et l'application**
- Crée le **réseau WiFi local**
- Reçoit les **données du smartphone**

---

## 🛠️ **ARCHITECTURE DU PROTOTYPE**

```
📱 Smartphone (Bracelet virtuel)
    ↓ WiFi
📡 Réseau WiFi local (PC)
    ↓
🖥️ PC (Chef de groupe)
    ↓
📱 Application mobile (sur PC)
```

---

## 📱 **ÉTAPE 1: APPLICATION "BRACELET" POUR SMARTPHONE**

### 🎯 **Fonctionnalités**
- **Scanner WiFi** et mesurer RSSI
- **Envoyer données** au backend (WebSocket)
- **Simuler batterie** et bouton SOS
- **Mode hors ligne** pour tests

### 📁 **Créer: BraceletApp.js**
```javascript
// À créer: prototype/BraceletApp.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wifi } from 'expo-wifi';
import io from 'socket.io-client';

export default function BraceletApp() {
  const [rssi, setRssi] = useState(-50);
  const [battery, setBattery] = useState(85);
  const [connected, setConnected] = useState(false);
  const [deviceId] = useState('BRACELET_' + Math.random().toString(36).substr(2, 9));

  // Connexion WebSocket au backend
  useEffect(() => {
    const socket = io('http://192.168.1.100:3000'); // IP de votre PC
    
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connecté au backend PC');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Envoyer données périodiquement
    const interval = setInterval(() => {
      if (connected) {
        sendBraceletData(socket);
      }
    }, 5000); // Toutes les 5 secondes

    return () => clearInterval(interval);
  }, [connected]);

  // Scanner WiFi et mesurer RSSI
  const scanRSSI = async () => {
    try {
      // Simuler scan RSSI (variations réalistes)
      const baseRSSI = -50;
      const variation = Math.random() * 20 - 10; // -10 à +10
      const newRSSI = Math.round(baseRSSI + variation);
      
      setRssi(newRSSI);
      
      // Simuler décharge batterie
      const batteryDrain = Math.random() * 0.5;
      setBattery(prev => Math.max(0, prev - batteryDrain));
      
    } catch (error) {
      console.error('Erreur scan RSSI:', error);
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
        x: Math.random() * 100, // Simulation position
        y: Math.random() * 100
      }
    };

    socket.emit('bracelet_data', data);
    console.log('Données envoyées:', data);
  };

  // Simulation bouton SOS
  const sendSOS = () => {
    if (connected) {
      const socket = io('http://192.168.1.100:3000');
      socket.emit('sos_alert', {
        deviceId: deviceId,
        timestamp: new Date().toISOString(),
        location: { x: Math.random() * 100, y: Math.random() * 100 }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Bracelet RSSI Prototype</Text>
      
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Connexion: {connected ? '✅ Connecté' : '❌ Déconnecté'}
        </Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>Device ID:</Text>
        <Text style={styles.dataValue}>{deviceId}</Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>RSSI:</Text>
        <Text style={[styles.dataValue, { color: getRSSIColor(rssi) }]}>
          {rssi} dBm
        </Text>
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.dataLabel}>Batterie:</Text>
        <Text style={[styles.dataValue, { color: getBatteryColor(battery) }]}>
          {Math.round(battery)}%
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={scanRSSI}
      >
        <Text style={styles.buttonText}>Scanner RSSI</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.sosButton}
        onPress={sendSOS}
      >
        <Text style={styles.sosButtonText}>🆘 SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  status: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
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
});
```

---

## 🖥️ **ÉTAPE 2: BACKEND MODIFIÉ POUR PROTOTYPE**

### 📁 **Créer: backend/prototype-server.js**
```javascript
// backend/prototype-server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Stockage des données prototype
let connectedBracelets = new Map();
let alerts = [];

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log(`Bracelet connecté: ${socket.id}`);

  // Réception données bracelet
  socket.on('bracelet_data', (data) => {
    console.log('Données bracelet reçues:', data);
    
    // Stocker les données
    connectedBracelets.set(data.deviceId, {
      ...data,
      lastSeen: new Date(),
      distance: calculateDistance(data.rssi)
    });

    // Diffuser à l'application mobile
    io.emit('bracelet_update', data);

    // Vérifier périmètre
    checkPerimeter(data);
  });

  // Réception alerte SOS
  socket.on('sos_alert', (data) => {
    console.log('ALERTE SOS:', data);
    
    const sosAlert = {
      id: Date.now(),
      type: 'SOS',
      deviceId: data.deviceId,
      message: `Alerte SOS du bracelet ${data.deviceId}`,
      timestamp: new Date(),
      resolved: false
    };

    alerts.push(sosAlert);
    io.emit('new_alert', sosAlert);
  });

  socket.on('disconnect', () => {
    console.log(`Bracelet déconnecté: ${socket.id}`);
  });
});

// Calcul distance RSSI
function calculateDistance(rssi) {
  const txPower = -50; // Puissance d'émission typique
  const n = 3.0; // Environnement intérieur
  
  if (rssi === 0) return 0;
  
  return Math.pow(10, (txPower - rssi) / (10 * n));
}

// Vérification périmètre
function checkPerimeter(data) {
  const maxDistance = 50; // 50m pour tests
  const distance = calculateDistance(data.rssi);
  
  if (distance > maxDistance) {
    const perimeterAlert = {
      id: Date.now(),
      type: 'PERIMETER_EXCEEDED',
      deviceId: data.deviceId,
      message: `Bracelet ${data.deviceId} hors périmètre (${Math.round(distance)}m)`,
      timestamp: new Date(),
      resolved: false
    };

    alerts.push(perimeterAlert);
    io.emit('new_alert', perimeterAlert);
  }
}

// API REST pour l'application mobile
app.get('/api/bracelets', (req, res) => {
  const bracelets = Array.from(connectedBracelets.values());
  res.json(bracelets);
});

app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = alerts.find(a => a.id === alertId);
  
  if (alert) {
    alert.resolved = true;
    io.emit('alert_resolved', { alertId });
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Alerte non trouvée' });
  }
});

// Démarrage serveur
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur prototype démarré sur http://localhost:${PORT}`);
  console.log(`📱 Connectez votre smartphone à: http://192.168.1.100:${PORT}`);
});
```

---

## 📱 **ÉTAPE 3: APPLICATION MOBILE MODIFIÉE**

### 📁 **Modifier: screens/PrototypeScreen.js**
```javascript
// screens/PrototypeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';

export default function PrototypeScreen() {
  const [bracelets, setBracelets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://192.168.1.100:3000');
    
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connecté au serveur prototype');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Mise à jour des bracelets
    socket.on('bracelet_update', (data) => {
      setBracelets(prev => {
        const updated = [...prev];
        const index = updated.findIndex(b => b.deviceId === data.deviceId);
        
        if (index >= 0) {
          updated[index] = data;
        } else {
          updated.push(data);
        }
        
        return updated;
      });
    });

    // Nouvelles alertes
    socket.on('new_alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    // Alertes résolues
    socket.on('alert_resolved', ({ alertId }) => {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
    });

    // Charger les données initiales
    fetch('http://192.168.1.100:3000/api/bracelets')
      .then(res => res.json())
      .then(data => setBracelets(data));

    return () => socket.disconnect();
  }, []);

  const renderBracelet = ({ item }) => (
    <View style={styles.braceletCard}>
      <Text style={styles.braceletName}>{item.deviceId}</Text>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>RSSI:</Text>
        <Text style={[styles.value, { color: getRSSIColor(item.rssi) }]}>
          {item.rssi} dBm
        </Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={[styles.value, { color: getDistanceColor(item.distance) }]}>
          {Math.round(item.distance)}m
        </Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Batterie:</Text>
        <Text style={[styles.value, { color: getBatteryColor(item.battery) }]}>
          {item.battery}%
        </Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Statut:</Text>
        <Text style={[styles.value, { color: '#10b981' }]}>
          {connected ? 'Connecté' : 'Déconnecté'}
        </Text>
      </View>
    </View>
  );

  const renderAlert = ({ item }) => (
    <View style={[
      styles.alertCard,
      { opacity: item.resolved ? 0.5 : 1 }
    ]}>
      <Text style={styles.alertType}>{item.type}</Text>
      <Text style={styles.alertMessage}>{item.message}</Text>
      <Text style={styles.alertTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
      
      {!item.resolved && (
        <TouchableOpacity 
          style={styles.resolveButton}
          onPress={() => resolveAlert(item.id)}
        >
          <Text style={styles.resolveButtonText}>Résoudre</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const resolveAlert = async (alertId) => {
    try {
      await fetch(`http://192.168.1.100:3000/api/alerts/${alertId}/resolve`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Prototype RSSI</Text>
      
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Serveur: {connected ? '✅ Connecté' : '❌ Déconnecté'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Bracelets Connectés</Text>
        <FlatList
          data={bracelets}
          renderItem={renderBracelet}
          keyExtractor={item => item.deviceId}
          style={styles.list}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Alertes</Text>
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      </View>
    </View>
  );
}

// Fonctions utilitaires (même que dans BraceletApp)
const getRSSIColor = (rssi) => {
  if (rssi > -60) return '#10b981';
  if (rssi > -75) return '#f59e0b';
  return '#ef4444';
};

const getDistanceColor = (distance) => {
  if (distance < 30) return '#10b981';
  if (distance < 60) return '#f59e0b';
  return '#ef4444';
};

const getBatteryColor = (battery) => {
  if (battery > 60) return '#10b981';
  if (battery > 30) return '#f59e0b';
  return '#ef4444';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  list: {
    maxHeight: 200,
  },
  braceletCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  braceletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  alertCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#f87171',
    marginBottom: 5,
  },
  alertTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 10,
  },
  resolveButton: {
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  resolveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

---

## 🚀 **PLAN D'ACTION IMMÉDIAT**

### 📱 **Jour 1: Application Bracelet Smartphone**
1. **Créer le projet** `npx create-expo-app BraceletPrototype`
2. **Installer les dépendances** : `expo-wifi`, `socket.io-client`
3. **Coder l'application** avec le code ci-dessus
4. **Tester sur votre smartphone**

### 🖥️ **Jour 2: Backend Prototype**
1. **Créer** `backend/prototype-server.js`
2. **Installer dépendances** : `socket.io`, `express`
3. **Démarrer le serveur** : `node prototype-server.js`
4. **Vérifier la connexion**

### 📱 **Jour 3: Application Mobile**
1. **Modifier votre App.js** pour inclure `PrototypeScreen`
2. **Tester l'affichage** des bracelets et alertes
3. **Valider les calculs** RSSI → distance

---

## 🎯 **TESTS À RÉALISER**

### 📡 **Tests RSSI**
- [ ] Scanner WiFi et mesurer RSSI
- [ ] Vérifier variations de signal
- [ ] Calculer distance estimée
- [ ] Tester précision (±5m)

### 📱 **Tests Connexion**
- [ ] Connexion smartphone ↔ backend
- [ ] Stabilité WebSocket
- [ ] Reconnexion automatique
- [ ] Gestion déconnexions

### 🚨 **Tests Alertes**
- [ ] Alerte périmètre (>50m)
- [ ] Bouton SOS fonctionnel
- [ ] Alerte batterie faible (<20%)
- [ ] Résolution alertes

### 📊 **Tests Interface**
- [ ] Affichage temps réel
- [ ] Mise à jour automatique
- [ ] Interface responsive
- [ ] Performance fluide

---

## 💰 **COÛT DU PROTOTYPE**

### 📱 **Smartphone (déjà possédé)**
- **Coût**: 0€
- **Utilisation**: Comme bracelet virtuel

### 🖥️ **PC (déjà possédé)**
- **Coût**: 0€
- **Utilisation**: Serveur backend + application

### 📦 **Développement**
- **Temps**: 2-3 jours
- **Coût**: 0€ (outils gratuits)

### 🎯 **Total du Prototype**
- **Investissement**: 0€
- **Temps**: 2-3 jours
- **Risque**: Nul

---

## 🎊 **AVANTAGES DU PROTOTYPE**

### ✅ **Tests Complets**
- **Chaîne RSSI complète** testée
- **Calculs distances** validés
- **Interface utilisateur** éprouvée
- **Alertes** fonctionnelles

### ✅ **Zéro Risque**
- **Aucun investissement** matériel
- **Tests rapides** et itératifs
- **Modifications faciles**
- **Validation avant achat**

### ✅ **Apprentissage**
- **Compréhension profonde** RSSI
- **Optimisation algorithmes**
- **Tests utilisateur réels**
- **Architecture validée**

---

# 🎉 **CONCLUSION**

## 🏆 **Solution Idéale**
Ce prototype vous permet de :
- ✅ **Tester 100% du système** sans investissement
- ✅ **Valider les calculs RSSI** en conditions réelles
- ✅ **Éprouver l'interface** utilisateur
- ✅ **Optimiser avant l'achat** des ESP32

## 🚀 **Prochaines Étapes**
1. **Créer l'application bracelet** pour votre smartphone
2. **Développer le backend prototype**
3. **Tester tous les scénarios**
4. **Analyser les résultats**
5. **Acheter les ESP32** en connaissance de cause

**C'est la meilleure approche pour garantir le succès !** 🚀✨🏆
