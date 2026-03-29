// Système d'IA Prédictif pour Mouvements et Anomalies
export class MovementPredictor {
  constructor() {
    this.memberHistory = new Map();
    this.anomalyThreshold = 0.7;
    this.predictionAccuracy = 0.85;
  }

  // Analyser l'historique des mouvements
  analyzeMovementHistory(memberId, locations) {
    const history = this.memberHistory.get(memberId) || [];
    history.push(...locations);
    
    // Garder seulement les 1000 derniers points
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
    
    this.memberHistory.set(memberId, history);
    
    return {
      patterns: this.detectPatterns(history),
      trends: this.calculateTrends(history),
      predictions: this.predictNextLocation(history)
    };
  }

  // Détecter les patterns de mouvement
  detectPatterns(history) {
    if (history.length < 10) return null;
    
    const patterns = {
      circular: this.detectCircularPattern(history),
      linear: this.detectLinearPattern(history),
      random: this.detectRandomPattern(history),
      periodic: this.detectPeriodicPattern(history)
    };
    
    return Object.keys(patterns)
      .filter(key => patterns[key].confidence > 0.6)
      .reduce((obj, key) => {
        obj[key] = patterns[key];
        return obj;
      }, {});
  }

  // Prédire la prochaine position
  predictNextLocation(history) {
    if (history.length < 5) return null;
    
    const recent = history.slice(-10);
    const velocity = this.calculateVelocity(recent);
    const acceleration = this.calculateAcceleration(recent);
    
    return {
      predictedLocation: {
        x: recent[recent.length - 1].x + velocity.x * 5 + acceleration.x * 12.5,
        y: recent[recent.length - 1].y + velocity.y * 5 + acceleration.y * 12.5,
        confidence: this.calculatePredictionConfidence(recent)
      },
      timeHorizon: 5000, // 5 secondes
      riskFactors: this.assessRiskFactors(recent)
    };
  }

  // Détecter les anomalies
  detectAnomalies(currentLocation, memberHistory) {
    const history = memberHistory.slice(-20);
    if (history.length < 5) return null;
    
    const anomalies = {
      speedAnomaly: this.detectSpeedAnomaly(currentLocation, history),
      directionAnomaly: this.detectDirectionAnomaly(currentLocation, history),
      locationAnomaly: this.detectLocationAnomaly(currentLocation, history),
      behaviorAnomaly: this.detectBehaviorAnomaly(currentLocation, history)
    };
    
    return Object.keys(anomalies)
      .filter(key => anomalies[key].severity > 0.5)
      .reduce((obj, key) => {
        obj[key] = anomalies[key];
        return obj;
      }, {});
  }

  // Calculer la vélocité
  calculateVelocity(locations) {
    if (locations.length < 2) return { x: 0, y: 0 };
    
    const recent = locations.slice(-2);
    const dt = (recent[1].timestamp - recent[0].timestamp) / 1000;
    
    return {
      x: (recent[1].x - recent[0].x) / dt,
      y: (recent[1].y - recent[0].y) / dt
    };
  }

  // Calculer l'accélération
  calculateAcceleration(locations) {
    if (locations.length < 3) return { x: 0, y: 0 };
    
    const recent = locations.slice(-3);
    const v1 = this.calculateVelocity([recent[0], recent[1]]);
    const v2 = this.calculateVelocity([recent[1], recent[2]]);
    const dt = (recent[2].timestamp - recent[1].timestamp) / 1000;
    
    return {
      x: (v2.x - v1.x) / dt,
      y: (v2.y - v1.y) / dt
    };
  }

  // Détecter pattern circulaire
  detectCircularPattern(history) {
    // Algorithme simplifié pour détecter les mouvements circulaires
    const center = this.calculateCenter(history);
    const radii = history.map(point => 
      Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
    );
    
    const radiusVariance = this.calculateVariance(radii);
    const isCircular = radiusVariance < 1000; // Seuil de variance
    
    return {
      detected: isCircular,
      confidence: isCircular ? 0.8 : 0.2,
      center: center,
      averageRadius: radii.reduce((a, b) => a + b, 0) / radii.length
    };
  }

  // Détecter pattern linéaire
  detectLinearPattern(history) {
    if (history.length < 3) return { detected: false, confidence: 0 };
    
    const start = history[0];
    const end = history[history.length - 1];
    const expectedLine = this.createLine(start, end);
    
    const deviations = history.map(point => 
      this.distanceToLine(point, expectedLine)
    );
    
    const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
    const isLinear = avgDeviation < 50; // Seuil de déviation
    
    return {
      detected: isLinear,
      confidence: isLinear ? 0.85 : 0.15,
      direction: Math.atan2(end.y - start.y, end.x - start.x)
    };
  }

  // Détecter les anomalies de vitesse
  detectSpeedAnomaly(current, history) {
    const speeds = this.calculateSpeeds(history);
    const currentSpeed = this.calculateSpeed(current, history[history.length - 1]);
    
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const speedRatio = currentSpeed / avgSpeed;
    
    return {
      severity: Math.abs(speedRatio - 1) > 2 ? 0.9 : 0.1,
      currentSpeed,
      averageSpeed: avgSpeed,
      anomaly: speedRatio > 3 || speedRatio < 0.3
    };
  }

  // Méthodes utilitaires
  calculateCenter(points) {
    const sum = points.reduce((acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }), { x: 0, y: 0 });
    
    return {
      x: sum.x / points.length,
      y: sum.y / points.length
    };
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  createLine(point1, point2) {
    const a = (point2.y - point1.y) / (point2.x - point1.x);
    const b = point1.y - a * point1.x;
    return { a, b };
  }

  distanceToLine(point, line) {
    return Math.abs(line.a * point.x - point.y + line.b) / Math.sqrt(line.a * line.a + 1);
  }

  calculateSpeeds(history) {
    const speeds = [];
    for (let i = 1; i < history.length; i++) {
      speeds.push(this.calculateSpeed(history[i], history[i - 1]));
    }
    return speeds;
  }

  calculateSpeed(point1, point2) {
    const distance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + 
      Math.pow(point2.y - point1.y, 2)
    );
    const time = (point2.timestamp - point1.timestamp) / 1000;
    return distance / time;
  }

  calculatePredictionConfidence(history) {
    // Plus l'historique est long et consistant, plus la confiance est élevée
    const baseConfidence = Math.min(history.length / 50, 1);
    const consistency = this.calculateConsistency(history);
    return baseConfidence * consistency * this.predictionAccuracy;
  }

  calculateConsistency(history) {
    if (history.length < 3) return 0.5;
    
    const speeds = this.calculateSpeeds(history);
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance = this.calculateVariance(speeds);
    
    return Math.max(0, 1 - (variance / (avgSpeed * avgSpeed)));
  }

  assessRiskFactors(history) {
    return {
      speedVariance: this.calculateVariance(this.calculateSpeeds(history)),
      directionChanges: this.countDirectionChanges(history),
      zoneRisk: this.assessZoneRisk(history),
      timeInCriticalZone: this.calculateTimeInCriticalZone(history)
    };
  }

  countDirectionChanges(history) {
    let changes = 0;
    for (let i = 2; i < history.length; i++) {
      const dir1 = Math.atan2(history[i-1].y - history[i-2].y, history[i-1].x - history[i-2].x);
      const dir2 = Math.atan2(history[i].y - history[i-1].y, history[i].x - history[i-1].x);
      if (Math.abs(dir2 - dir1) > Math.PI / 2) changes++;
    }
    return changes;
  }

  assessZoneRisk(history) {
    // Simplifié : basé sur les positions
    const criticalZones = [{ x: 0, y: 0, radius: 20 }]; // Zone critique autour de l'origine
    let riskScore = 0;
    
    history.forEach(point => {
      criticalZones.forEach(zone => {
        const distance = Math.sqrt(
          Math.pow(point.x - zone.x, 2) + 
          Math.pow(point.y - zone.y, 2)
        );
        if (distance < zone.radius) riskScore += 0.1;
      });
    });
    
    return Math.min(riskScore, 1);
  }

  calculateTimeInCriticalZone(history) {
    // Simplifié : temps passé dans les zones critiques
    let criticalTime = 0;
    
    for (let i = 1; i < history.length; i++) {
      const inCriticalZone = this.assessZoneRisk([history[i]]) > 0;
      if (inCriticalZone) {
        criticalTime += history[i].timestamp - history[i - 1].timestamp;
      }
    }
    
    return criticalTime;
  }

  // Patterns non implémentés pour simplifier
  detectRandomPattern(history) { return { detected: true, confidence: 0.3 }; }
  detectPeriodicPattern(history) { return { detected: false, confidence: 0.1 }; }
  detectDirectionAnomaly(current, history) { return { severity: 0.1 }; }
  detectLocationAnomaly(current, history) { return { severity: 0.1 }; }
  detectBehaviorAnomaly(current, history) { return { severity: 0.1 }; }
}

export class AnomalyDetector {
  constructor() {
    this.thresholds = {
      speed: { min: 0.1, max: 10 }, // m/s
      acceleration: { max: 5 }, // m/s²
      directionChange: { max: Math.PI }, // radians
      proximity: { min: 5 }, // mètres
      battery: { critical: 20 } // pourcentage
    };
  }

  detectAnomalies(memberData, historicalData) {
    const anomalies = [];
    
    // Anomalie de vitesse
    if (memberData.speed > this.thresholds.speed.max || 
        memberData.speed < this.thresholds.speed.min) {
      anomalies.push({
        type: 'SPEED_ANOMALY',
        severity: 'HIGH',
        value: memberData.speed,
        threshold: this.thresholds.speed,
        message: `Vitesse anormale détectée: ${memberData.speed.toFixed(2)} m/s`
      });
    }
    
    // Anomalie de batterie
    if (memberData.battery < this.thresholds.battery.critical) {
      anomalies.push({
        type: 'BATTERY_CRITICAL',
        severity: 'CRITICAL',
        value: memberData.battery,
        threshold: this.thresholds.battery.critical,
        message: `Batterie critique: ${memberData.battery}%`
      });
    }
    
    // Anomalie de RSSI
    if (memberData.rssi < -90) {
      anomalies.push({
        type: 'SIGNAL_LOST',
        severity: 'HIGH',
        value: memberData.rssi,
        message: `Signal très faible: ${memberData.rssi} dBm`
      });
    }
    
    return anomalies;
  }

  generateAlert(anomaly) {
    return {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: anomaly.type,
      severity: anomaly.severity,
      message: anomaly.message,
      data: anomaly,
      resolved: false
    };
  }
}
