import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

// Import des écrans corrigés
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler une vérification d'authentification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Par défaut, non authentifié
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
      } catch (err) {
        console.error('Erreur vérification auth:', err);
        setError(err.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    try {
      setIsAuthenticated(true);
      setUser({
        id: userData.id || 1,
        name: userData.name || 'Administrateur',
        email: userData.email || 'admin@rssi.com',
        role: userData.role || 'admin'
      });
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      setError(err.message);
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ color: '#94a3b8', marginTop: 20 }}>Chargement...</Text>
      </View>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Text style={{ color: '#ef4444', fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Erreur: {error}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#3b82f6', padding: 15, borderRadius: 8 }}
          onPress={() => window.location.reload()}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Réessayer</Text>
        </TouchableOpacity>
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
                error={error}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen 
                  {...props} 
                  user={user}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Dashboard">
              {(props) => (
                <DashboardScreen 
                  {...props} 
                  user={user}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
