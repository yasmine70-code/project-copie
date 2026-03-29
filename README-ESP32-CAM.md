# ESP32 CAM - RSSI Surveillance System

Ce serveur permet de faire fonctionner votre système RSSI avec des cartes ESP32 CAM pour la surveillance en temps réel.

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
# Installer les dépendances du serveur ESP32
npm install --package esp32-package.json

# Ou manuellement:
npm install express socket.io cors multer uuid dotenv node-fetch
```

### 2. Configuration

1. Copiez le fichier d'environnement:
```bash
cp esp32-server.env .env
```

2. Modifiez le fichier `.env` avec vos configurations:
- `ESP32_PORT`: Port du serveur ESP32 (par défaut: 3001)
- `MAIN_BACKEND_URL`: URL du backend principal (par défaut: http://localhost:3000)

### 3. Démarrage

```bash
# Démarrer le serveur ESP32
npm start

# Ou en mode développement avec auto-reload
npm run dev
```

Le serveur démarrera sur `http://localhost:3001`

## 📱 Configuration ESP32 CAM

### Matériel requis

- ESP32 CAM (modèle AI-Thinker recommandé)
- Module GPS (optionnel, pour coordonnées)
- Capteur de batterie
- Antenne Bluetooth (pour RSSI)

### Installation du code sur l'ESP32

1. Ouvrez l'Arduino IDE
2. Installez les bibliothèques nécessaires:
   - `WiFi`
   - `HTTPClient`
   - `ArduinoJson`
   - `BluetoothSerial`
   - `Base64`

3. Configurez le fichier `esp32-cam-example.ino`:
   ```cpp
   const char* ssid = "VOTRE_SSID";
   const char* password = "VOTRE_MOT_DE_PASSE";
   const char* serverUrl = "http://VOTRE_IP_SERVEUR:3001";
   const String deviceId = "ESP32_CAM_001";
   const String memberId = "MEMBER_001";
   ```

4. Uploadez le code sur l'ESP32 CAM

## 🔌 API Endpoints

### Envoi d'images
```
POST /upload-image
Content-Type: multipart/form-data

Body:
- image: fichier image
- memberId: ID du membre
- deviceId: ID du dispositif
- timestamp: timestamp ISO
- location: coordonnées GPS (JSON)
- rssi: valeur RSSI
- battery: niveau de batterie (%)
```

### Envoi de données capteurs
```
POST /sensor-data
Content-Type: application/json

{
  "deviceId": "ESP32_CAM_001",
  "memberId": "MEMBER_001",
  "rssi": -75.5,
  "battery": 85,
  "location": {
    "lat": 48.8566,
    "lng": 2.3522
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Liste des dispositifs connectés
```
GET /devices

Response:
{
  "devices": [
    {
      "deviceId": "ESP32_CAM_001",
      "connectedAt": "2024-01-01T12:00:00.000Z",
      "lastSeen": "2024-01-01T12:05:00.000Z",
      "memberId": "MEMBER_001",
      "status": "active"
    }
  ]
}
```

### Santé du serveur
```
GET /health

Response:
{
  "status": "OK",
  "service": "ESP32 CAM Server",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "connectedDevices": 3,
  "uptime": 3600
}
```

## 🔌 WebSocket Events

### Client → Serveur

#### Enregistrement d'un dispositif
```javascript
socket.emit('register-device', {
  deviceId: 'ESP32_CAM_001',
  memberId: 'MEMBER_001',
  deviceType: 'ESP32_CAM'
});
```

#### Envoi de données capteurs en temps réel
```javascript
socket.emit('sensor-data', {
  rssi: -75.5,
  battery: 85,
  location: { lat: 48.8566, lng: 2.3522 }
});
```

#### Streaming vidéo
```javascript
socket.emit('video-frame', {
  image: 'base64_encoded_image',
  timestamp: '2024-01-01T12:00:00.000Z'
});
```

#### Ping/pong
```javascript
socket.emit('ping');
socket.on('pong', (data) => {
  console.log('Pong reçu:', data.timestamp);
});
```

### Serveur → Client

#### Nouvelle image reçue
```javascript
socket.on('new-image', (data) => {
  console.log('Image reçue:', data.imagePath);
  // data.imagePath: URL de l'image
  // data.memberId: ID du membre
  // data.timestamp: timestamp
});
```

#### Mise à jour des capteurs
```javascript
socket.on('sensor-update', (data) => {
  console.log('Données capteurs:', data);
  // data.rssi, data.battery, data.location, etc.
});
```

#### Streaming vidéo en direct
```javascript
socket.on('video-stream', (data) => {
  console.log('Frame vidéo reçue');
  // data.image: image encodée en base64
  // data.deviceId: ID du dispositif
});
```

#### Connexion/déconnexion de dispositifs
```javascript
socket.on('device-connected', (data) => {
  console.log('Dispositif connecté:', data.deviceId);
});

socket.on('device-disconnected', (data) => {
  console.log('Dispositif déconnecté:', data.deviceId);
});
```

## 📁 Structure des fichiers

```
uploads/esp32-cam/
├── MEMBER_001/
│   ├── capture_1640995200000.jpg
│   └── capture_1640995260000.jpg
├── MEMBER_002/
│   └── capture_1640995320000.jpg
└── unknown/
    └── capture_1640995380000.jpg
```

## 🔧 Configuration avancée

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `ESP32_PORT` | Port du serveur ESP32 | `3001` |
| `MAIN_BACKEND_URL` | URL du backend principal | `http://localhost:3000` |
| `UPLOAD_MAX_SIZE` | Taille max des uploads (bytes) | `10485760` |
| `MAX_CONNECTED_DEVICES` | Nombre max de dispositifs | `50` |
| `DEVICE_INACTIVE_TIMEOUT` | Timeout inactivité (ms) | `60000` |

### Intégration avec le backend principal

Le serveur ESP32 transmet automatiquement les données au backend principal:

- Images: `POST /api/images`
- Données capteurs: `POST /api/sensor-data`

Assurez-vous que votre backend principal expose ces endpoints.

## 🚨 Gestion des erreurs

### Codes d'erreur HTTP

- `400`: Données invalides
- `404`: Endpoint non trouvé
- `413`: Fichier trop volumineux
- `500`: Erreur serveur

### Erreurs WebSocket

Le serveur émet des événements `error` avec des messages descriptifs:
- `Dispositif non enregistré`
- `Erreur traitement données`
- `Format image invalide`

## 🔍 Débogage

### Logs du serveur

```bash
# Activer les logs détaillés
DEBUG=* npm start

# Logs en fichier
npm start > logs/esp32-server.log 2>&1
```

### Test des endpoints

```bash
# Tester la santé du serveur
curl http://localhost:3001/health

# Tester l'envoi de données capteurs
curl -X POST http://localhost:3001/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "TEST_001",
    "rssi": -75.5,
    "battery": 85
  }'
```

## 📊 Monitoring

### Métriques disponibles

- Nombre de dispositifs connectés
- Fréquence d'envoi des images
- Qualité du signal RSSI
- Niveaux de batterie
- Taux d'erreur de transmission

### Webhook de notifications

Configurez `WEBHOOK_URL` pour recevoir des notifications:
- Connexion/déconnexion de dispositifs
- Alertes RSSI critiques
- Niveaux de batterie faibles

## 🔒 Sécurité

- Limitation du taux de requêtes
- Validation des types de fichiers
- Taille maximale des uploads
- CORS configurable
- Timeout des connexions inactives

## 📝 Notes importantes

1. **Performance**: Limitez le nombre d'images envoyées pour préserver la bande passante
2. **Batterie**: Adaptez les intervalles d'envoi selon la consommation énergétique
3. **Stockage**: Surveillez l'espace disque utilisé par les images uploadées
4. **Réseau**: Assurez-vous que l'ESP32 a une connexion WiFi stable

## 🆘 Support

En cas de problème:

1. Vérifiez les logs du serveur
2. Testez la connectivité réseau
3. Validez le format des données envoyées
4. Consultez la documentation de l'ESP32 CAM

---

**Version**: 1.0.0  
**Auteur**: RSSI Surveillance System  
**Licence**: MIT
