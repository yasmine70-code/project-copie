# 🎯 **ROADMAP COMPLÈTE - SYSTÈME RSSI ESP32/WIFI LOCAL**

## 📅 **Date**: 27 Février 2026
## 👤 **Développeur**: Yasmine
## 📋 **Projet**: Système de Supervision de Groupe Basé sur RSSI

---

## 📋 **CAHIER DES CHARGES ANALYSÉ**

### 🎯 **Objectif Principal**
Système autonome de surveillance de groupe **sans Internet ni GPS** basé sur :
- **RSSI via WiFi local**
- **Bracelets ESP32**
- **Application mobile chef de groupe**
- **Portée 100-150m**

### 🏗️ **Architecture Cible**
```
📱 Chef de groupe (Application)
    ↓ WiFi Access Point
📡 Réseau WiFi local (100-150m)
    ↓
⌚ Bracelets ESP32 (membres)
    ↓
📊 Données RSSI + Batterie + SOS
```

---

## ✅ **CE QUE VOUS AVEZ DÉJÀ**

### 📱 **Application Mobile**
- ✅ **Interface complète** (Login, Home, Dashboard)
- ✅ **Design responsive** et moderne
- ✅ **WebSocket temps réel** (Socket.io)
- ✅ **Base de données** SQLite
- ✅ **Authentification** JWT
- ✅ **Animations fluides**

### 🖥️ **Backend Actuel**
- ✅ **Serveur Express.js** complet
- ✅ **WebSocket** pour temps réel
- ✅ **API REST** structurée
- ✅ **Base de données** fonctionnelle
- ✅ **Sécurité** (Helmet, CORS)

---

## 🚨 **CE QUI MANQUE POUR LE CAHIER DES CHARGES**

### ⌚ **1. Code ESP32 pour Bracelets**

#### ❌ **Manque: Firmware ESP32**
```cpp
// À créer: firmware/bracelet-esp32/
├── bracelet-esp32.ino          // Code principal
├── wifi-manager.cpp             // Gestion WiFi
├── rssi-scanner.cpp            // Scan RSSI
├── battery-monitor.cpp          // Surveillance batterie
├── sos-button.cpp              // Bouton SOS
├── data-transmitter.cpp         // Transmission données
└── config.h                   // Configuration
```

#### ✅ **Fonctionnalités ESP32 Requises**
```cpp
class BraceletESP32 {
  // Connexion WiFi automatique
  void connectToWiFi(String ssid, String password);
  
  // Scan RSSI périodique (5-10s)
  void scanRSSI();
  
  // Surveillance batterie
  float getBatteryLevel();
  
  // Bouton SOS
  void handleSOSButton();
  
  // Transmission données
  void transmitData();
  
  // Mode économie d'énergie
  void enterPowerSaveMode();
};
```

### 📡 **2. Mode Access Point WiFi**

#### ❌ **Manque: Serveur WiFi AP**
```javascript
// À créer: backend/wifi-ap-server.js
class WiFiAPServer {
  constructor() {
    this.apInterface = null;
    this.connectedDevices = new Map();
  }
  
  // Créer réseau WiFi local
  async createAccessPoint(ssid, password) {
    // ESP32 en mode Access Point
    // Canal WiFi optimisé
    // Configuration DHCP
  }
  
  // Scanner les bracelets connectés
  async scanConnectedDevices() {
    // Liste des MAC addresses
    // Mesure RSSI par device
    // Suivi connexion/déconnexion
  }
}
```

### 📡 **3. Communication ESP32 ↔ Backend**

#### ❌ **Manque: Protocole de Communication**
```javascript
// À créer: backend/esp32-communication.js
class ESP32Communication {
  constructor() {
    this.devices = new Map();
    this.rssiHistory = new Map();
  }
  
  // Recevoir données bracelets
  async receiveBraceletData(data) {
    // { deviceId, rssi, battery, sos, timestamp }
    // Mise à jour base de données
    // Notification temps réel
  }
  
  // Calculer distance RSSI
  calculateDistance(rssi, frequency = 2400) {
    // Formule path loss
    // Distance approximative
    // Compensation environnementale
  }
  
  // Vérifier périmètre
  checkPerimeter(deviceId, maxDistance) {
    // Distance actuelle vs seuil
    // Alerte si dépassement
  }
}
```

### 📱 **4. Interface Chef de Groupe**

#### ❌ **Manque: Mode Chef de Groupe**
```javascript
// À modifier: screens/ChefScreen.js
class ChefScreen extends React.Component {
  constructor() {
    this.wifiAP = null;
    this.connectedBracelets = new Map();
  }
  
  // Démarrer réseau WiFi local
  async startLocalNetwork() {
    // Activer mode Access Point
    // Scanner bracelets
    // Démarrer monitoring
  }
  
  // Afficher distances en temps réel
  renderDistanceMap() {
    // Carte de proximité
    // Indicateurs: Proche/Moyen/Loin
    // Alertes périmètre
  }
  
  // Gérer alertes SOS
  handleSOSAlert(deviceId) {
    // Notification prioritaire
    // Son/vibration
    // Interface d'urgence
  }
}
```

---

## 🛠️ **DÉVELOPPEMENTS NÉCESSAIRES**

### ⌚ **Phase 1: Firmware ESP32 (2-3 semaines)**

#### 📋 **1.1 Code Base ESP32**
```cpp
// firmware/bracelet-esp32/bracelet-esp32.ino
#include <WiFi.h>
#include <ESP32Ping.h>
#include <Battery.h>
#include <SOS.h>

class BraceletESP32 {
private:
  String deviceID;
  String ssid;
  String password;
  unsigned long lastTransmission;
  bool sosPressed;
  
public:
  void setup() {
    // Initialisation WiFi
    // Configuration device ID
    // Setup bouton SOS
    // Calibration batterie
  }
  
  void loop() {
    // Scan RSSI toutes les 5-10s
    // Vérifier niveau batterie
    // Gérer bouton SOS
    // Transmettre données
  }
};
```

#### 📋 **1.2 Gestion WiFi**
```cpp
// firmware/bracelet-esp32/wifi-manager.cpp
class WiFiManager {
public:
  bool connectToAP(String ssid, String password) {
    // Connexion au réseau du chef
    // Tentatives reconnexion automatique
    // Gestion perte de signal
  }
  
  int getRSSI() {
    // Mesure puissance signal
    // Filtrage du bruit
    // Moyenne sur 3 mesures
  }
  
  bool isConnected() {
    // Vérifier connexion WiFi
    // Ping vers chef
  }
};
```

#### 📋 **1.3 Surveillance Batterie**
```cpp
// firmware/bracelet-esp32/battery-monitor.cpp
class BatteryMonitor {
private:
  int batteryPin;
  float voltage;
  int percentage;
  
public:
  float getBatteryPercentage() {
    // Lecture ADC
    // Conversion voltage
    // Calcul pourcentage
  }
  
  bool isLowBattery() {
    // Alerte si < 20%
  }
  
  void enterPowerSave() {
    // Réduction consommation
    // Diminution fréquence scan
  }
};
```

### 📡 **Phase 2: Backend WiFi AP (1-2 semaines)**

#### 📋 **2.1 Serveur Access Point**
```javascript
// backend/wifi-ap-server.js
const wifi = require('node-wifi');
const { spawn } = require('child_process');

class WiFiAPServer {
  constructor() {
    this.ssid = 'RSSI_GROUP';
    this.password = 'rssi123456';
    this.channel = 6; // Canal optimal
    this.connectedDevices = new Map();
  }
  
  async startAccessPoint() {
    // Configuration ESP32 en mode AP
    // Démarrage serveur DHCP
    // Monitoring des connexions
  }
  
  async scanDevices() {
    // Scan réseau toutes les 5s
    // Mesure RSSI par device
    // Détection nouveaux/cas
  }
  
  calculateDistance(rssi) {
    // Formule: distance = 10^((TxPower - RSSI) / (10 * N))
    // N = 2.7 à 4.3 (environnement)
    return Math.pow(10, (-50 - rssi) / (10 * 3.0));
  }
}
```

#### 📋 **2.2 Communication ESP32**
```javascript
// backend/esp32-communication.js
class ESP32Communication {
  constructor(wifiAPServer) {
    this.wifiAP = wifiAPServer;
    this.devices = new Map();
    this.alerts = [];
  }
  
  async receiveDeviceData(deviceId, data) {
    // { rssi, battery, sos, timestamp }
    this.devices.set(deviceId, {
      ...data,
      lastSeen: new Date(),
      distance: this.calculateDistance(data.rssi)
    });
    
    // Vérifier périmètre
    this.checkPerimeter(deviceId);
    
    // Gérer SOS
    if (data.sos) {
      this.handleSOS(deviceId);
    }
    
    // Notifier application mobile
    this.notifyMobileApp(deviceId, data);
  }
  
  checkPerimeter(deviceId) {
    const device = this.devices.get(deviceId);
    const maxDistance = 100; // 100m par défaut
    
    if (device.distance > maxDistance) {
      this.generateAlert(deviceId, 'PERIMETER_EXCEEDED');
    }
  }
}
```

### 📱 **Phase 3: Interface Mobile (2-3 semaines)**

#### 📋 **3.1 Écran Chef de Groupe**
```javascript
// screens/ChefScreen.js
export default function ChefScreen() {
  const [isAPActive, setIsAPActive] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState(new Map());
  const [alerts, setAlerts] = useState([]);
  
  // Démarrer réseau local
  const startLocalNetwork = async () => {
    try {
      await WiFiAPServer.start('RSSI_GROUP', 'rssi123456');
      setIsAPActive(true);
      startDeviceMonitoring();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer le réseau WiFi');
    }
  };
  
  // Monitoring des bracelets
  const startDeviceMonitoring = () => {
    setInterval(async () => {
      const devices = await WiFiAPServer.scanDevices();
      setConnectedDevices(new Map(devices));
      checkAlerts(devices);
    }, 5000);
  };
  
  // Interface de proximité
  const renderProximityMap = () => {
    return (
      <View style={styles.proximityMap}>
        {Array.from(connectedDevices.values()).map(device => (
          <View key={device.id} style={[
            styles.deviceIndicator,
            { 
              backgroundColor: getProximityColor(device.distance),
              transform: [{ scale: getProximityScale(device.distance) }]
            }
          ]}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceDistance}>
              {Math.round(device.distance)}m
            </Text>
            <Text style={styles.deviceStatus}>
              {getProximityLabel(device.distance)}
            </Text>
          </View>
        ))}
      </View>
    );
  };
}
```

#### 📋 **3.2 Indicateurs de Proximité**
```javascript
// utils/proximity-utils.js
export const getProximityColor = (distance) => {
  if (distance < 30) return '#10b981';  // Vert - Proche
  if (distance < 80) return '#f59e0b';  // Orange - Moyen
  return '#ef4444';                    // Rouge - Loin
};

export const getProximityLabel = (distance) => {
  if (distance < 30) return 'Proche';
  if (distance < 80) return 'Moyen';
  return 'Loin';
};

export const getProximityScale = (distance) => {
  if (distance < 30) return 1.2;      // Plus grand si proche
  if (distance < 80) return 1.0;
  return 0.8;                          // Plus petit si loin
};
```

---

## 🏗️ **ARCHITECTURE TECHNIQUE COMPLÈTE**

### ⌚ **Bracelet ESP32**
```
🔧 Composants:
├── ESP32 Dev Board (~$10-15)
├── Batterie Li-ion 3.7V (~$5-10)
├── Bouton SOS (~$1-2)
├── LED indicatrice (~$0.50)
├── Boîtier 3D imprimé (~$5-10)
└── Chargeur USB (~$3-5)

TOTAL par bracelet: ~$25-45
```

### 📡 **Réseau WiFi Local**
```
🔧 Configuration:
├── SSID: "RSSI_GROUP"
├── Mot de passe: "rssi123456"
├── Canal: 6 (optimal)
├── Fréquence: 2.4GHz
├── Portée: 100-150m
└── Protocole: 802.11n
```

### 📱 **Application Chef**
```
🔧 Fonctionnalités:
├── Mode Access Point WiFi
├── Scan RSSI temps réel
├── Calcul distances
├── Carte de proximité
├── Alertes périmètre
├── Notifications SOS
├── Surveillance batterie
└── Interface offline
```

---

## 📊 **BASE DE DONNÉES SPÉCIFIQUE**

### 🗄️ **Tables RSSI**
```sql
-- Bracelets enregistrés
CREATE TABLE bracelets (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  mac_address VARCHAR(17) UNIQUE,
  device_type VARCHAR(50),
  max_battery INTEGER DEFAULT 100,
  created_at TIMESTAMP
);

-- Mesures RSSI temps réel
CREATE TABLE rssi_measurements (
  id UUID PRIMARY KEY,
  bracelet_id UUID REFERENCES bracelets(id),
  rssi_value INTEGER NOT NULL,
  distance_estimated FLOAT,
  battery_level INTEGER,
  sos_active BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bracelet_time (bracelet_id, timestamp)
);

-- Configurations de périmètre
CREATE TABLE perimeters (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  max_distance INTEGER DEFAULT 100,
  alert_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP
);

-- Alertes système
CREATE TABLE system_alerts (
  id UUID PRIMARY KEY,
  bracelet_id UUID REFERENCES bracelets(id),
  alert_type ENUM('PERIMETER_EXCEEDED', 'SOS', 'LOW_BATTERY', 'CONNECTION_LOST'),
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  message TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

---

## 🎯 **PLAN D'ACTION DÉTAILLÉ**

### ⌚ **Semaine 1-2: Firmware ESP32**
- [ ] Installation environnement ESP32
- [ ] Code base WiFi manager
- [ ] Surveillance batterie
- [ ] Bouton SOS
- [ ] Tests sur breadboard

### 📡 **Semaine 3-4: Backend WiFi AP**
- [ ] Serveur Access Point
- [ ] Communication ESP32
- [ ] Calcul distances RSSI
- [ ] Base de données spécifique
- [ ] API temps réel

### 📱 **Semaine 5-6: Interface Mobile**
- [ ] Écran chef de groupe
- [ ] Carte de proximité
- [ ] Alertes périmètre
- [ ] Notifications SOS
- [ ] Mode offline complet

### 🧪 **Semaine 7-8: Tests & Validation**
- [ ] Tests portée (100-150m)
- [ ] Tests précision RSSI
- [ ] Tests autonomie batterie
- [ ] Tests fiabilité connexion
- [ ] Documentation complète

---

## 💰 **BUDGET ESTIMÉ**

### ⌚ **Matériel pour 5 Bracelets**
```
🔧 Composants:
├── 5x ESP32 Dev Board: $50-75
├── 5x Batterie Li-ion: $25-50
├── 5x Boutons SOS: $5-10
├── 5x Boîtiers 3D: $25-50
├── 5x Chargeurs USB: $15-25
└── Outils & câbles: $20-30

TOTAL: ~$140-240
```

### 💻 **Développement**
```
👨‍💻 Temps estimé:
├── Firmware ESP32: 80h
├── Backend WiFi AP: 60h
├── Interface mobile: 80h
├── Tests & validation: 40h
└── Documentation: 20h

TOTAL: ~280h de développement
```

---

## 🎊 **VALIDATION CRITÈRES**

### ✅ **Tests de Validation**
- [ ] **Connexion automatique**: Bracelets se connectent au réseau local
- [ ] **Distance affichée**: RSSI converti en distance approximative
- [ ] **Alertes périmètre**: Notification si >100m
- [ ] **Bouton SOS**: Alerte immédiate sur application
- [ ] **Batterie**: Surveillance et alerte faible niveau
- [ ] **Sans Internet**: Fonctionnement 100% offline
- [ ] **Portée**: Minimum 100m en environnement ouvert
- [ ] **Mise à jour**: <10 secondes entre mesures

---

## 🎉 **CONCLUSION**

### 🏆 **Votre Situation Actuelle**
Vous avez une **excellente base** avec :
- ✅ **Application mobile** complète et moderne
- ✅ **Backend robuste** avec WebSocket
- ✅ **Interface responsive** et professionnelle
- ✅ **Architecture scalable** prête pour ESP32

### 🚀 **Prochaines Étapes**
1. **Acheter 2-3 ESP32** pour commencer les tests
2. **Développer firmware** de base (WiFi + RSSI)
3. **Créer serveur AP** dans votre backend
4. **Adapter interface mobile** pour mode chef
5. **Tests progressifs** et validation

### 🎯 **Avantages du Cahier des Charges**
- **Coût très faible** (~$25-45 par bracelet)
- **Architecture simple** et robuste
- **Fonctionnement offline** garanti
- **Portée adaptée** (100-150m)
- **Facile à développer** avec votre base existante

---

# 🎊 **MISSION CLAIRE ET RÉALISABLE !**

Votre cahier des charges est **excellent** et **réaliste**. Avec votre base actuelle, vous pouvez implémenter ce système RSSI en **6-8 semaines** avec un budget matériel très modéré.

**Excellent projet !** 🚀✨🏆
