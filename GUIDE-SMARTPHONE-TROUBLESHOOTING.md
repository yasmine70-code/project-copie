# 📱 **GUIDE COMPLET - DÉPANNAGE APPLICATION SMARTPHONE**

## 📅 **Date**: 9 Mars 2026
## 👤 **Développeur**: Yasmine
## 🎯 **Problème**: Application ne s'ouvre pas sur smartphone

---

## 🔍 **DIAGNOSTIC RAPIDE**

### ✅ **État Actuel du Serveur**
```
✅ Serveur Expo: Démarré avec succès
✅ Port: 8097
✅ URL: exp://10.246.17.10:8097
✅ Web: http://localhost:8097
✅ Metro Bundler: Actif
✅ Cache: Nettoyé
```

### 📱 **Étapes pour Ouvrir sur Smartphone**

#### 🎯 **Méthode 1: Expo Go (Recommandée)**
1. **Installer Expo Go** sur votre smartphone
   - Android: Play Store → "Expo Go"
   - iOS: App Store → "Expo Go"

2. **Scanner le QR Code**
   - Ouvrir Expo Go
   - Appuyer sur "Scan QR Code"
   - Scanner le QR code affiché dans le terminal

3. **L'application devrait s'ouvrir automatiquement**

#### 🎯 **Méthode 2: URL Manuelle**
1. **Ouvrir Expo Go**
2. **Appuyer sur "Enter URL manually"**
3. **Entrer**: `exp://10.246.17.10:8097`

---

## 🚨 **PROBLÈMES POSSIBLES ET SOLUTIONS**

### 📡 **1. Problème de Réseau**

#### ❌ **Symptôme**
- QR code ne se scanne pas
- Message "Network error"
- L'application ne charge pas

#### ✅ **Solutions**
```bash
# Vérifier que vous êtes sur le même réseau WiFi
# Smartphone et ordinateur doivent être sur le même WiFi

# Si ça ne marche pas, essayer avec l'adresse IP locale
ipconfig  # Sur Windows
# Chercher "Adresse IPv4" (ex: 192.168.1.100)

# Redémarrer avec l'IP locale
npx expo start --clear --tunnel
```

#### 📱 **Test de Connexion**
```
1. Sur smartphone: Ouvrir le navigateur
2. Aller à: http://10.246.17.10:8097
3. Si ça ne marche pas → problème réseau
```

### 📱 **2. Problème Expo Go**

#### ❌ **Symptôme**
- Expo Go ne se lance pas
- Erreur "Unsupported SDK version"
- L'application se ferme immédiatement

#### ✅ **Solutions**
```
📱 Vérifier la version d'Expo Go:
- Mettre à jour Expo Go (dernière version)
- Vérifier compatibilité SDK (v54.0.33)

📱 Réinstaller Expo Go:
- Désinstaller l'application
- Réinstaller depuis le store
- Scanner à nouveau le QR code
```

### 🔧 **3. Problème de Dépendances**

#### ❌ **Symptôme**
- Erreur de compilation
- Écran blanc
- L'application crash au démarrage

#### ✅ **Solutions**
```bash
# Nettoyer complètement le projet
npx expo install --fix

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer avec cache nettoyé
npx expo start --clear --reset-cache
```

### 📱 **4. Problème de Permissions**

#### ❌ **Symptôme**
- L'application demande des permissions
- Refuse de s'ouvrir après permissions

#### ✅ **Solutions**
```
📱 Android:
- Aller dans Paramètres → Applications → Expo Go
- Autoriser toutes les permissions demandées
- Stockage, Caméra, Localisation, etc.

📱 iOS:
- Aller dans Réglages → Expo Go
- Activer toutes les permissions
- Autoriser les "Apps non vérifiées" si nécessaire
```

---

## 🛠️ **DIAGNOSTIC AVANCÉ**

### 📋 **Étape 1: Vérifier le Serveur**
```bash
# Le serveur doit afficher:
› Metro waiting on exp://10.246.17.10:8097
› Scan the QR code above with Expo Go
› Web is waiting on http://localhost:8097
```

### 📋 **Étape 2: Tester la Connexion**
```bash
# Sur ordinateur:
curl http://localhost:8097

# Sur smartphone (navigateur):
http://10.246.17.10:8097
```

### 📋 **Étape 3: Vérifier Expo Go**
```
📱 Ouvrir Expo Go
📱 Vérifier version: 2.30+ recommandée
📱 Tester avec l'URL: exp://10.246.17.10:8097
```

---

## 🎯 **SOLUTIONS SPÉCIFIQUES**

### 📡 **Solution 1: Utiliser le Mode Tunnel**
```bash
# Si problème réseau local
npx expo start --tunnel

# Cela créera une URL publique
# Ex: exp://random-hash.exp.direct:80
```

### 📱 **Solution 2: Générer un Build**
```bash
# Pour tester sans Expo Go
npx expo build:android
# ou
npx expo build:ios

# Génère un APK/IPA à installer directement
```

### 🔧 **Solution 3: Utiliser le Simulator**
```bash
# Pour tester sans smartphone physique
npx expo start --android  # Si Android Studio installé
npx expo start --ios      # Si Xcode installé (macOS)
```

---

## 📊 **LOGS ET DÉBOGAGE**

### 📋 **Voir les Logs en Temps Réel**
```bash
# Dans le terminal Expo, appuyer sur:
d  # Pour voir les logs du device
```

### 📱 **Logs sur Smartphone**
```
📱 Dans Expo Go:
- Secouer le téléphone
- Menu "Debug" → "Remote JS Debugging"
- Ouvre Chrome DevTools

📱 Pour voir les erreurs:
- Console → Network
- Console → Console
```

---

## 🎯 **VÉRIFICATION FINALE**

### ✅ **Checklist Complète**
```
☐ Serveur Expo démarré (port 8097)
☐ Ordinateur et smartphone sur même WiFi
☐ Expo Go installé et à jour
☐ QR code scanné avec succès
☐ Permissions accordées
☐ Application se lance
☐ Écran de login visible
☐ Connexion avec admin@rssi.com / admin123
```

### 🚨 **Si Toujours Problème**
```
1. Redémarrer complètement l'ordinateur
2. Réinstaller Expo Go
3. Essayer sur un autre smartphone
4. Utiliser le mode tunnel (--tunnel)
5. Contacter le support Expo
```

---

## 📞 **ASSISTANCE TECHNIQUE**

### 🛠️ **Commandes Utiles**
```bash
# Forcer le redémarrage
npx expo start --clear --reset-cache

# Vérifier la configuration
npx expo doctor

# Mettre à jour Expo CLI
npm install -g @expo/cli

# Diagnostic réseau
npx expo start --web --port 19006
```

### 📱 **Test Final**
```
1. Démarrer: npx expo start --clear
2. Scanner QR code avec Expo Go
3. Attendre le chargement
4. Tester login: admin@rssi.com / admin123
5. Vérifier que l'interface s'affiche
```

---

# 🎉 **SOLUTION RAPIDE**

## 🎯 **Test Immédiat**
```bash
# 1. Arrêter le serveur actuel (Ctrl+C)
# 2. Démarrer avec tunnel
npx expo start --tunnel

# 3. Scanner le nouveau QR code
# 4. L'application devrait fonctionner
```

## 📱 **Alternative: Web**
Si le smartphone ne fonctionne pas, testez sur web:
```
URL: http://localhost:8097
Navigateur: Chrome/Firefox/Safari
```

---

# 🚀 **BONNE CHANCE !**

Si vous suivez ces étapes, votre application devrait s'ouvrir normalement sur smartphone. Le problème le plus courant est généralement lié au réseau WiFi ou à la version d'Expo Go.

**N'hésitez pas si vous avez besoin d'aide supplémentaire !** 🎊
