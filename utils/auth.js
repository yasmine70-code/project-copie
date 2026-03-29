import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  IS_AUTHENTICATED: '@is_authenticated',
};

// Clé JWT pour le stockage local (en production, utilisez une clé sécurisée)
const JWT_SECRET = 'rssi-surveillance-secret-key';

export class AuthService {
  // Connexion de l'utilisateur
  static async login(credentials) {
    try {
      const { email, password } = credentials;
      
      // Appel API (remplacez par votre vrai endpoint)
      const response = await this.apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Stocker les informations
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
        
        return { success: true, user, token };
      } else {
        throw new Error(response.message || 'Échec de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, message: error.message };
    }
  }

  // Déconnexion
  static async logout() {
    try {
      // Nettoyer le stockage local
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.IS_AUTHENTICATED,
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, message: error.message };
    }
  }

  // Vérifier si l'utilisateur est authentifié
  static async isAuthenticated() {
    try {
      const isAuth = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      
      return isAuth === 'true' && token !== null;
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      return false;
    }
  }

  // Récupérer les données utilisateur
  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erreur récupération données utilisateur:', error);
      return null;
    }
  }

  // Récupérer le token
  static async getToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  }

  // Mettre à jour les données utilisateur
  static async updateUserData(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour données utilisateur:', error);
      return { success: false, message: error.message };
    }
  }

  // Vérifier la validité du token (simple validation)
  static isTokenValid(token) {
    if (!token) return false;
    
    try {
      // Décoder le token JWT (simple validation)
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      
      // Vérifier si le token n'est pas expiré
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erreur validation token:', error);
      return false;
    }
  }

  // Rafraîchir le token
  static async refreshToken() {
    try {
      const currentToken = await this.getToken();
      if (!currentToken) {
        throw new Error('Aucun token à rafraîchir');
      }
      
      // Appel API pour rafraîchir le token
      const response = await this.apiCall('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      });
      
      if (response.success) {
        const { token } = response.data;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        return { success: true, token };
      } else {
        throw new Error(response.message || 'Échec de rafraîchissement');
      }
    } catch (error) {
      console.error('Erreur rafraîchissement token:', error);
      // En cas d'erreur, déconnecter l'utilisateur
      await this.logout();
      return { success: false, message: error.message };
    }
  }

  // Appel API générique avec authentification
  static async apiCall(endpoint, options = {}) {
    try {
      const token = await this.getToken();
      const baseUrl = 'http://localhost:3000'; // Configurez votre URL backend
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };
      
      const response = await fetch(`${baseUrl}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur API call:', error);
      throw error;
    }
  }

  // Initialisation de l'authentification au démarrage
  static async initializeAuth() {
    try {
      const isAuth = await this.isAuthenticated();
      const token = await this.getToken();
      
      if (isAuth && token && this.isTokenValid(token)) {
        const userData = await this.getUserData();
        return { 
          isAuthenticated: true, 
          user: userData,
          token 
        };
      } else {
        // Token invalide, nettoyer et rediriger vers login
        await this.logout();
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
      await this.logout();
      return { isAuthenticated: false };
    }
  }

  // Simulation de connexion (pour le développement)
  static async mockLogin(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@rssi.com' && password === 'admin123') {
          const mockUser = {
            id: '1',
            email: email,
            name: 'Administrateur RSSI',
            role: 'admin',
            permissions: ['read', 'write', 'admin'],
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          resolve({
            success: true,
            user: mockUser,
            token: mockToken,
          });
        } else {
          resolve({
            success: false,
            message: 'Email ou mot de passe incorrect',
          });
        }
      }, 1000);
    });
  }
}

// Hook React pour l'authentification
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = await AuthService.initializeAuth();
        setIsAuthenticated(authData.isAuthenticated);
        setUser(authData.user || null);
      } catch (error) {
        console.error('Erreur initialisation auth hook:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await AuthService.login(credentials);
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Erreur login hook:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Erreur logout hook:', error);
      return { success: false, message: error.message };
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};
