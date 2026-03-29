import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ARView({ members, onClose, onMemberSelect }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [arOverlays, setArOverlays] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [arMode, setArMode] = useState('standard'); // standard, thermal, xray, path
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermissions();
    startAnimations();
    calculateAROverlays();
  }, [members, location]);

  const requestPermissions = async () => {
    const cameraPermission = await ExpoCamera.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    
    setHasPermission(cameraPermission.status === 'granted');
    
    if (locationPermission.status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }
  };

  const startAnimations = () => {
    // Animation de pulse pour les marqueurs
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de fade pour les overlays
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const calculateAROverlays = () => {
    if (!location || !members) return;

    const overlays = members.map(member => {
      const distance = calculateDistance(location.coords, member.location);
      const bearing = calculateBearing(location.coords, member.location);
      const screenPosition = getScreenPosition(bearing, distance);
      
      return {
        id: member.id,
        name: member.name,
        distance,
        bearing,
        screenX: screenPosition.x,
        screenY: screenPosition.y,
        rssi: member.rssi,
        battery: member.battery,
        status: member.status,
        riskLevel: calculateRiskLevel(member),
        predictedPath: member.predictedPath || []
      };
    });

    setArOverlays(overlays);
  };

  const calculateDistance = (coord1, coord2) => {
    // Formule de Haversine simplifiée pour les courtes distances
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const calculateBearing = (coord1, coord2) => {
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const getScreenPosition = (bearing, distance) => {
    // Conversion des coordonnées polaires en coordonnées d'écran
    const angle = (bearing - 90) * Math.PI / 180; // Ajustement pour l'écran
    const maxDistance = 100; // Distance maximale pour l'affichage
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    // Position sur l'écran basée sur la direction et la distance
    const radius = Math.min(screenWidth, screenHeight) * 0.4;
    const x = screenWidth / 2 + Math.cos(angle) * radius * (1 - normalizedDistance * 0.5);
    const y = screenHeight / 2 + Math.sin(angle) * radius * (1 - normalizedDistance * 0.5);
    
    return { x: Math.max(50, Math.min(screenWidth - 50, x)), 
             y: Math.max(100, Math.min(screenHeight - 100, y)) };
  };

  const calculateRiskLevel = (member) => {
    let riskScore = 0;
    
    // Risque basé sur la distance
    if (member.distance > 50) riskScore += 0.3;
    if (member.distance > 100) riskScore += 0.4;
    
    // Risque basé sur le RSSI
    if (member.rssi < -70) riskScore += 0.2;
    if (member.rssi < -85) riskScore += 0.3;
    
    // Risque basé sur la batterie
    if (member.battery < 30) riskScore += 0.2;
    if (member.battery < 15) riskScore += 0.3;
    
    // Risque basé sur le statut
    if (member.status === 'warning') riskScore += 0.3;
    if (member.status === 'critical') riskScore += 0.5;
    
    return riskScore;
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel < 0.3) return '#10b981';  // Vert - Faible risque
    if (riskLevel < 0.6) return '#f59e0b';  // Orange - Risque moyen
    return '#ef4444';                        // Rouge - Risque élevé
  };

  const renderAROverlay = (overlay) => {
    const scale = pulseAnim.interpolate({
      inputRange: [1, 1.2],
      outputRange: [1, 1.2],
    });

    return (
      <Animated.View
        key={overlay.id}
        style={[
          styles.arOverlay,
          {
            left: overlay.screenX - 40,
            top: overlay.screenY - 40,
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.overlayMarker,
            { borderColor: getRiskColor(overlay.riskLevel) }
          ]}
          onPress={() => {
            setSelectedMember(overlay);
            onMemberSelect?.(overlay);
          }}
        >
          <View style={[
            styles.markerDot,
            { backgroundColor: getRiskColor(overlay.riskLevel) }
          ]} />
          
          {/* Indicateur de direction */}
          <Animated.View
            style={[
              styles.directionIndicator,
              {
                opacity: 0.8
              }
            ]}
          >
            <Ionicons name="navigate" size={12} color="white" />
          </Animated.View>
        </TouchableOpacity>

        {/* Informations du membre */}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{overlay.name}</Text>
          <Text style={styles.memberDistance}>{Math.round(overlay.distance)}m</Text>
          
          {/* Barres de statut */}
          <View style={styles.statusBars}>
            <View style={styles.statusBar}>
              <Text style={styles.statusLabel}>RSSI:</Text>
              <Text style={[styles.statusValue, { color: overlay.rssi > -70 ? '#10b981' : '#f59e0b' }]}>
                {overlay.rssi} dBm
              </Text>
            </View>
            
            <View style={styles.statusBar}>
              <Text style={styles.statusLabel}>🔋:</Text>
              <Text style={[styles.statusValue, { color: overlay.battery > 30 ? '#10b981' : '#ef4444' }]}>
                {overlay.battery}%
              </Text>
            </View>
          </View>
        </View>

        {/* Ligne de direction vers le membre */}
        {arMode === 'path' && (
          <View style={[
            styles.directionLine,
            {
              backgroundColor: getRiskColor(overlay.riskLevel),
              width: Math.min(overlay.distance * 2, 200),
            }
          ]} />
        )}
      </Animated.View>
    );
  };

  const renderARControls = () => {
    return (
      <View style={styles.arControls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            arMode === 'standard' && styles.activeControl
          ]}
          onPress={() => setArMode('standard')}
        >
          <Ionicons name="eye" size={24} color="white" />
          <Text style={styles.controlText}>Standard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            arMode === 'thermal' && styles.activeControl
          ]}
          onPress={() => setArMode('thermal')}
        >
          <MaterialIcons name="whatshot" size={24} color="white" />
          <Text style={styles.controlText}>Thermique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            arMode === 'xray' && styles.activeControl
          ]}
          onPress={() => setArMode('xray')}
        >
          <Ionicons name="radio" size={24} color="white" />
          <Text style={styles.controlText}>X-Ray</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            arMode === 'path' && styles.activeControl
          ]}
          onPress={() => setArMode('path')}
        >
          <Ionicons name="route" size={24} color="white" />
          <Text style={styles.controlText}>Chemin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderARFilter = () => {
    const getFilterStyle = () => {
      switch (arMode) {
        case 'thermal':
          return {
            backgroundColor: 'rgba(255, 100, 0, 0.2)',
            overlayColor: 'rgba(255, 150, 0, 0.3)',
          };
        case 'xray':
          return {
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            overlayColor: 'rgba(0, 255, 255, 0.2)',
          };
        case 'path':
          return {
            backgroundColor: 'rgba(100, 255, 100, 0.1)',
            overlayColor: 'rgba(100, 255, 100, 0.2)',
          };
        default:
          return {
            backgroundColor: 'transparent',
            overlayColor: 'rgba(59, 130, 246, 0.1)',
          };
      }
    };

    const filterStyle = getFilterStyle();

    return (
      <View style={[styles.arFilter, { backgroundColor: filterStyle.backgroundColor }]}>
        <Text style={styles.filterLabel}>Mode: {arMode.toUpperCase()}</Text>
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Demande de permission caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Permission caméra refusée</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.permissionButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Caméra en arrière-plan */}
      <ExpoCamera style={styles.camera} type={ExpoCamera.Constants.Type.back}>
        {/* Filtre AR */}
        {renderARFilter()}

        {/* Overlays AR */}
        {arOverlays.map(overlay => renderAROverlay(overlay))}

        {/* Contrôles AR */}
        {renderARControls()}

        {/* HUD Information */}
        <View style={styles.hud}>
          <View style={styles.hudTop}>
            <Text style={styles.hudTitle}>🎯 Vue AR</Text>
            <Text style={styles.hudSubtitle}>
              {arOverlays.length} membres détectés
            </Text>
          </View>

          <View style={styles.hudBottom}>
            <TouchableOpacity style={styles.hudButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.hudButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Compas */}
        <View style={styles.compass}>
          <Text style={styles.compassText}>N</Text>
        </View>
      </ExpoCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  arFilter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  arOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    zIndex: 2,
  },
  overlayMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  directionIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    position: 'absolute',
    top: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  memberName: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  memberDistance: {
    color: '#94a3b8',
    fontSize: 10,
    marginBottom: 4,
  },
  statusBars: {
    gap: 2,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    color: '#64748b',
    fontSize: 9,
  },
  statusValue: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  directionLine: {
    position: 'absolute',
    top: 30,
    left: 30,
    height: 2,
    opacity: 0.8
  },
  arControls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  activeControl: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderColor: '#3b82f6',
  },
  controlText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  hudTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    alignItems: 'center',
  },
  hudTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hudSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  hudBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hudButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hudButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  compass: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    zIndex: 3,
  },
  compassText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    top: 5,
  },
  filterLabel: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    padding: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
