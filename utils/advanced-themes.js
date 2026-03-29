// Thèmes avancés et dynamiques pour l'application
export const AdvancedThemes = {
  // Thème principal - Futuriste
  futuristic: {
    background: {
      primary: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'],
      secondary: ['#1e293b', '#334155', '#475569'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#8b5cf6',
      neon: '#00ffff',
      hologram: '#ff00ff',
    },
    glass: {
      background: 'rgba(30, 41, 59, 0.8)',
      border: 'rgba(148, 163, 184, 0.2)',
      blur: 10,
    },
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.7,
        shadowRadius: 40,
        elevation: 25,
      },
      neon: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
      }
    }
  },

  // Thème urgence - Alertes
  emergency: {
    background: {
      primary: ['#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444'],
      secondary: ['#7f1d1d', '#991b1b', '#b91c1c'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    },
    colors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#8b5cf6',
      neon: '#ff0000',
      hologram: '#ff6b6b',
    },
    glass: {
      background: 'rgba(127, 29, 29, 0.8)',
      border: 'rgba(239, 68, 68, 0.3)',
      blur: 15,
    },
    pulses: {
      fast: 500,
      medium: 1000,
      slow: 2000,
    }
  },

  // Thème nuit - Mode sombre
  night: {
    background: {
      primary: ['#000000', '#0a0a0a', '#141414', '#1a1a1a', '#262626', '#404040'],
      secondary: ['#0a0a0a', '#141414', '#1a1a1a'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    },
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#a78bfa',
      neon: '#00ff88',
      hologram: '#ff00ff',
    },
    glass: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: 'rgba(100, 100, 100, 0.2)',
      blur: 20,
    }
  },

  // Thème pro - Professionnel
  pro: {
    background: {
      primary: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
      secondary: ['#334155', '#475569', '#64748b'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      }
    },
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#7c3aed',
      neon: '#00d4ff',
      hologram: '#00ff88',
    },
    glass: {
      background: 'rgba(51, 65, 85, 0.9)',
      border: 'rgba(148, 163, 184, 0.3)',
      blur: 8,
    }
  },

  // Thème holographique - AR/VR
  holographic: {
    background: {
      primary: ['#0a0a0a', '#1a0033', '#330066', '#4d0099', '#6600cc', '#7f00ff'],
      secondary: ['#1a0033', '#330066', '#4d0099'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    },
    colors: {
      primary: '#7f00ff',
      secondary: '#6600cc',
      accent: '#9933ff',
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff3366',
      info: '#00ccff',
      neon: '#ff00ff',
      hologram: '#00ffff',
    },
    glass: {
      background: 'rgba(127, 0, 255, 0.1)',
      border: 'rgba(255, 0, 255, 0.3)',
      blur: 25,
    },
    hologram: {
      opacity: 0.8,
      scanlines: true,
      glitch: true,
    }
  },

  // Thème matrix - Style cyberpunk
  matrix: {
    background: {
      primary: ['#000000', '#0f0f0f', '#1a1a1a', '#262626', '#00ff00', '#00ff00'],
      secondary: ['#0f0f0f', '#1a1a1a', '#262626'],
      gradient: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      }
    },
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00ff88',
      success: '#00ff00',
      warning: '#ffaa00',
      error: '#ff0000',
      info: '#00ccff',
      neon: '#00ff00',
      hologram: '#00ff88',
    },
    glass: {
      background: 'rgba(0, 255, 0, 0.05)',
      border: 'rgba(0, 255, 0, 0.2)',
      blur: 30,
    },
    matrix: {
      rain: true,
      characters: true,
      opacity: 0.7,
    }
  }
};

// Gestionnaire de thèmes dynamiques
export class ThemeManager {
  constructor() {
    this.currentTheme = 'futuristic';
    this.themes = AdvancedThemes;
    this.listeners = [];
  }

  // Changer de thème
  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Obtenir le thème actuel
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  // Obtenir un thème spécifique
  getTheme(themeName) {
    return this.themes[themeName];
  }

  // Thème automatique selon le contexte
  setContextualTheme(context) {
    switch (context) {
      case 'emergency':
        return this.setTheme('emergency');
      case 'night':
        return this.setTheme('night');
      case 'ar':
        return this.setTheme('holographic');
      case 'pro':
        return this.setTheme('pro');
      case 'matrix':
        return this.setTheme('matrix');
      default:
        return this.setTheme('futuristic');
    }
  }

  // Écouter les changements de thème
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Notifier les écouteurs
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getCurrentTheme()));
  }

  // Thème aléatoire
  setRandomTheme() {
    const themeNames = Object.keys(this.themes);
    const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
    return this.setTheme(randomTheme);
  }

  // Obtenir tous les thèmes disponibles
  getAvailableThemes() {
    return Object.keys(this.themes);
  }
}

// Instance globale du gestionnaire de thèmes
export const themeManager = new ThemeManager();

// Hooks pour React
export const useTheme = () => {
  const [theme, setTheme] = React.useState(themeManager.getCurrentTheme());

  React.useEffect(() => {
    const handleThemeChange = (newTheme) => {
      setTheme(newTheme);
    };

    themeManager.addListener(handleThemeChange);

    return () => {
      const index = themeManager.listeners.indexOf(handleThemeChange);
      if (index > -1) {
        themeManager.listeners.splice(index, 1);
      }
    };
  }, []);

  return theme;
};

// Styles dynamiques basés sur le thème
export const createDynamicStyles = (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary[0],
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  glassCard: {
    backgroundColor: theme.glass.background,
    borderWidth: 1,
    borderColor: theme.glass.border,
    borderRadius: 16,
    ...theme.shadows.medium,
  },
  neonText: {
    color: theme.colors.neon,
    textShadow: `0 0 10px ${theme.colors.neon}`,
  },
  hologramView: {
    opacity: theme.hologram?.opacity || 0.8,
    borderWidth: 1,
    borderColor: theme.colors.hologram,
  },
  emergencyButton: {
    backgroundColor: theme.colors.error,
    ...theme.shadows.neon,
  },
  successButton: {
    backgroundColor: theme.colors.success,
    ...theme.shadows.neon,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.neon,
  },
});

// Couleurs dynamiques selon le statut
export const getStatusColors = (status, theme) => {
  const colors = theme.colors;
  switch (status) {
    case 'online':
      return { background: colors.success, border: colors.success, text: '#ffffff' };
    case 'offline':
      return { background: '#64748b', border: '#64748b', text: '#ffffff' };
    case 'warning':
      return { background: colors.warning, border: colors.warning, text: '#ffffff' };
    case 'error':
    case 'sos':
      return { background: colors.error, border: colors.error, text: '#ffffff' };
    default:
      return { background: colors.primary, border: colors.primary, text: '#ffffff' };
  }
};
