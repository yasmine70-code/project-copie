# Améliorations de la Base de Données

## 🗄️ Optimisations SQL

### Indexes Recommandés
```sql
-- Index pour les performances de recherche
CREATE INDEX idx_members_rssi ON members(rssi);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_last_seen ON members(last_seen);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alerts_member_id ON alerts(member_id);

-- Index composite pour les requêtes complexes
CREATE INDEX idx_members_status_location ON members(status, location);
CREATE INDEX idx_alerts_type_status ON alerts(type, status);
```

### Schéma Amélioré
```sql
-- Table membres optimisée
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rssi INTEGER DEFAULT -100,
  battery INTEGER DEFAULT 100,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'emergency')),
  location TEXT,
  device_info TEXT, -- JSON avec infos sur l'appareil
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table alertes avec plus de détails
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('low_battery', 'sos', 'connection_lost', 'geofence')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT,
  data TEXT, -- JSON avec données additionnelles
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by TEXT,
  acknowledged_at DATETIME,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by TEXT,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Table sessions pour le suivi
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration INTEGER, -- en secondes
  avg_rssi REAL,
  min_battery INTEGER,
  alerts_count INTEGER DEFAULT 0,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Table geofences
CREATE TABLE geofences (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius INTEGER DEFAULT 100, -- en mètres
  type TEXT DEFAULT 'safe' CHECK (type IN ('safe', 'danger', 'warning')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Stratégies de Performance

### 1. **Partitionnement**
- Partitionner les tables par date pour les données historiques
- Archiver les anciennes données dans des tables séparées

### 2. **Cache Layer**
```javascript
// Implémentation Redis
const redis = require('redis');
const client = redis.createClient();

// Cache des données de membres
async function getCachedMembers() {
  const cached = await client.get('members:active');
  if (cached) return JSON.parse(cached);
  
  const members = await db.query('SELECT * FROM members WHERE status = "online"');
  await client.setex('members:active', 60, JSON.stringify(members));
  return members;
}
```

### 3. **Data Archiving**
- Archiver les sessions de plus de 6 mois
- Compresser les anciennes alertes
- Maintenir des statistiques agrégées

## 🔍 Monitoring & Analytics

### Métriques à Suivre
- **Performance** : Temps de réponse des requêtes
- **Utilisation** : Nombre de membres actifs
- **Alertes** : Fréquence et types d'alertes
- **Batterie** : Niveaux moyens et critiques

### Dashboard Analytics
- Graphiques de tendance RSSI
- Cartes de chaleur des localisations
- Statistiques des alertes par type
- Monitoring de la santé du système
