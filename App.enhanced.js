import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import EnhancedHomeScreen from './components/EnhancedHomeScreen';
import HolographicDashboard from './components/HolographicDashboard';
import VoiceAIAssistant from './components/VoiceAIAssistant';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error('Erreur vérification auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleVoiceCommand = (command) => {
    console.log('Commande vocale:', command);
    
    // Traiter les commandes vocales
    switch (command.type) {
      case 'navigate':
        // Navigation vers une destination
        if (command.entities.destination === 'dashboard') {
          // Naviguer vers le dashboard
        }
        break;
      case 'locate':
        // Localiser un membre
        break;
      case 'alert':
        // Envoyer une alerte
        break;
      case 'status':
        // Vérifier le statut
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen 
                {...props} 
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <EnhancedHomeScreen 
                  {...props} 
                  user={user}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Dashboard">
              {(props) => (
                <HolographicDashboard 
                  {...props} 
                  user={user}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="VoiceAssistant">
              {(props) => (
                <VoiceAIAssistant 
                  {...props}
                  user={user}
                  onCommand={handleVoiceCommand}
                  isActive={voiceAssistantActive}
                  setIsActive={setVoiceAssistantActive}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
