# 🚀 Backend RSSI Surveillance

Backend Node.js pour le système de supervision RSSI avec WebSocket en temps réel.

## 📋 Fonctionnalités

- **WebSocket** pour communication temps réel
- **Base de données SQLite** pour la persistance
- **API REST** pour la gestion des membres et alertes
- **Authentification JWT** sécurisée
- **Détection d'anomalies** RSSI
- **Calcul d'environnement** et de distance
- **Alertes SOS** et périmètre
- **Historique** des positions

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd backend

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env
# Éditer .env avec vos valeurs

# Démarrer en développement
npm run dev

# Démarrer en production
npm start
```

## 🔧 Configuration

Variables d'environnement (`.env`) :

```env
PORT=3000
JWT_SECRET=votre-secret-securise
RSSI_TX_POWER=-59
PERIMETER_THRESHOLD=-95
```

## 📡 API Endpoints

### Membres
- `GET /api/members` - Liste des membres actifs
- `GET /api/members/:id` - Détails d'un membre
- `POST /api/members` - Ajouter un membre
- `PUT /api/members/:id` - Mettre à jour un membre
- `DELETE /api/members/:id` - Supprimer un membre
- `GET /api/members/:id/history` - Historique de position

### Alertes
- `GET /api/alerts` - Liste des alertes actives
- `GET /api/alerts/:id` - Détails d'une alerte
- `POST /api/alerts` - Créer une alerte
- `POST /api/alerts/sos` - Créer une alerte SOS
- `PUT /api/alerts/:id/resolve` - Résoudre une alerte
- `GET /api/alerts/stats` - Statistiques des alertes

### WebSocket Events
- `connection` - Nouveau client connecté
- `rssi-update` - Mise à jour RSSI
- `sos-alert` - Alerte SOS
- `member-update` - Mise à jour membre
- `ping/pong` - Maintien de connexion

## 🗄️ Structure Base de Données

### Tables
- **members** : Informations des membres
- **alerts** : Historique des alertes
- **position_history** : Historique des positions RSSI

## 🔐 Authentification

```bash
# Login (endpoint à créer)
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

# Réponse
{
  "success": true,
  "token": "jwt-token-here",
  "user": { "id": "admin", "role": "admin" }
}
```

## 📊 Exemple d'utilisation

### Client WebSocket (JavaScript)

```javascript
const socket = io('ws://localhost:3000');

// Envoyer des données RSSI
socket.emit('rssi-update', {
  memberId: 'member-123',
  rssi: -72,
  battery: 85,
  location: '48.8566,2.3522',
  timestamp: new Date()
});

// Écouter les mises à jour
socket.on('member-update', (data) => {
  console.log('Membre mis à jour:', data);
});

// Écouter les alertes SOS
socket.on('sos-alert', (alert) => {
  console.log('🚨 ALERTE SOS:', alert);
});
```

### Client HTTP (curl)

```bash
# Récupérer les membres
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/members

# Créer une alerte SOS
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"memberId": "member-123", "location": "48.8566,2.3522"}' \
     http://localhost:3000/api/alerts/sos
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests de charge (optionnel)
npm run test:load
```

## 📝 Développement

```bash
# Mode développement avec rechargement automatique
npm run dev

# Voir les logs
tail -f logs/app.log

# Base de données SQLite
sqlite3 data/surveillance.db
.tables
SELECT * FROM members;
```

## 🔒 Sécurité

- **JWT** pour l'authentification
- **Helmet** pour les headers HTTP
- **CORS** configuré
- **Validation** des entrées
- **Sanitization** des données
- **Rate limiting** (à implémenter)

## 🚀 Déploiement

### Docker
```bash
# Construire l'image
docker build -t rssi-backend .

# Lancer le conteneur
docker run -p 3000:3000 -v $(pwd)/data:/app/data rssi-backend
```

### PM2
```bash
# Installer PM2
npm install -g pm2

# Démarrer avec PM2
pm2 start server.js --name "rssi-backend"

# Voir les logs
pm2 logs rssi-backend
```

## 📈 Monitoring

- Health check : `GET /health`
- Métriques en temps réel via WebSocket
- Logs structurés avec Morgan
- Statistiques des alertes disponibles

## 🐛 Débogage

```bash
# Mode debug
DEBUG=* npm run dev

# Voir les requêtes SQL
export DEBUG=sql
```

## 📚 Documentation

- **API Documentation** : `/api-docs` (à implémenter avec Swagger)
- **WebSocket Events** : Voir section WebSocket ci-dessus
- **Database Schema** : Voir section Base de données

---

**Auteur** : Votre Nom  
**License** : MIT  
**Version** : 1.0.0
