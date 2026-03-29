const crypto = require('crypto');

// Générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculer la distance RSSI
function calculateDistance(rssi) {
  const txPower = -59; // RSSI à 1 mètre
  const n = 2; // facteur environnement
  
  return Math.pow(10, (txPower - rssi) / (10 * n)).toFixed(2);
}

// Déterminer l'environnement
function calculateEnvironment(rssi) {
  if (rssi >= -55) {
    return {
      type: 'Espace ouvert',
      range: '100-150m',
      color: '#10b981',
      icon: '☀️'
    };
  } else if (rssi >= -75) {
    return {
      type: 'Semi-obstrué',
      range: '50-100m',
      color: '#f59e0b',
      icon: '⛅'
    };
  } else if (rssi >= -95) {
    return {
      type: 'Fortement obstrué',
      range: '20-50m',
      color: '#ef4444',
      icon: '🏢'
    };
  } else {
    return {
      type: 'Hors portée',
      range: '>150m',
      color: '#991b1b',
      icon: '❌'
    };
  }
}

// Valider les données RSSI
function validateRSSIData(data) {
  const { memberId, rssi, battery, location } = data;
  
  const errors = [];
  
  if (!memberId || typeof memberId !== 'string') {
    errors.push('ID de membre invalide');
  }
  
  if (rssi !== undefined && (typeof rssi !== 'number' || rssi < -120 || rssi > 0)) {
    errors.push('RSSI doit être un nombre entre -120 et 0');
  }
  
  if (battery !== undefined && (typeof battery !== 'number' || battery < 0 || battery > 100)) {
    errors.push('La batterie doit être un nombre entre 0 et 100');
  }
  
  if (location && typeof location !== 'string') {
    errors.push('La localisation doit être une chaîne de caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Formatter la date
function formatDate(date) {
  return new Date(date).toISOString();
}

// Calculer les statistiques
function calculateStats(data) {
  if (!data || data.length === 0) {
    return {
      total: 0,
      average: 0,
      min: 0,
      max: 0
    };
  }
  
  const values = data.map(item => item.value || item);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  return {
    total,
    average: (total / values.length).toFixed(2),
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  };
}

// Générer un hash
function generateHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Nettoyer et valider les entrées
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les caractères HTML potentiellement dangereux
    .substring(0, 255); // Limiter la longueur
}

// Vérifier si un membre est hors périmètre
function isOutOfPerimeter(rssi, perimeter = -95) {
  return rssi <= perimeter;
}

// Détecter les anomalies
function detectAnomalies(history, threshold = 2) {
  if (!history || history.length < 3) {
    return [];
  }
  
  const anomalies = [];
  const recent = history.slice(-10); // Dernières 10 lectures
  
  for (let i = 1; i < recent.length; i++) {
    const current = recent[i];
    const previous = recent[i - 1];
    
    // Détection de saut RSSI anormal
    if (Math.abs(current.rssi - previous.rssi) > threshold * 10) {
      anomalies.push({
        type: 'RSSI_JUMP',
        timestamp: current.timestamp,
        from: previous.rssi,
        to: current.rssi,
        severity: 'high'
      });
    }
    
    // Détection de chute de batterie rapide
    if (previous.battery - current.battery > 10) {
      anomalies.push({
        type: 'BATTERY_DROP',
        timestamp: current.timestamp,
        from: previous.battery,
        to: current.battery,
        severity: 'medium'
      });
    }
  }
  
  return anomalies;
}

module.exports = {
  generateId,
  calculateDistance,
  calculateEnvironment,
  validateRSSIData,
  formatDate,
  calculateStats,
  generateHash,
  sanitizeInput,
  isOutOfPerimeter,
  detectAnomalies
};
