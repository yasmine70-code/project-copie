/*
 * ESP32 CAM - RSSI Surveillance System
 * Code exemple pour la carte ESP32 CAM
 * Envoie les données RSSI, GPS, batterie et images au serveur Node.js
 */

#include "WiFi.h"
#include "WiFiClient.h"
#include "WebServer.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "Base64.h"
#include "HTTPClient.h"
#include "ArduinoJson.h"
#include "BluetoothSerial.h"
#include "esp_bt.h"

// Configuration WiFi
const char* ssid = "VOTRE_SSID";
const char* password = "VOTRE_MOT_DE_PASSE";

// Configuration serveur
const char* serverUrl = "http://192.168.1.100:3001"; // IP de votre serveur
const char* mainBackendUrl = "http://192.168.1.100:3000";

// Configuration dispositif
const String deviceId = "ESP32_CAM_001";
const String memberId = "MEMBER_001";

// Pins pour la caméra ESP32 CAM
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

// Variables globales
BluetoothSerial SerialBT;
unsigned long lastDataSend = 0;
unsigned long lastImageSend = 0;
int batteryLevel = 100;
float currentRSSI = 0.0;
String lastLocation = "";

// Intervalle d'envoi (en millisecondes)
const unsigned long DATA_SEND_INTERVAL = 5000;  // 5 secondes
const unsigned long IMAGE_SEND_INTERVAL = 30000; // 30 secondes

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Désactiver le brownout detector
  
  Serial.begin(115200);
  Serial.println("🚀 Démarrage ESP32 CAM - RSSI Surveillance");

  // Initialiser la caméra
  initCamera();
  
  // Initialiser le WiFi
  initWiFi();
  
  // Initialiser le Bluetooth pour RSSI
  initBluetooth();
  
  // Initialiser le GPS (si connecté)
  initGPS();
  
  Serial.println("✅ Système initialisé avec succès");
}

void loop() {
  unsigned long currentTime = millis();
  
  // Envoyer les données capteurs périodiquement
  if (currentTime - lastDataSend >= DATA_SEND_INTERVAL) {
    sendSensorData();
    lastDataSend = currentTime;
  }
  
  // Envoyer une image périodiquement
  if (currentTime - lastImageSend >= IMAGE_SEND_INTERVAL) {
    captureAndSendImage();
    lastImageSend = currentTime;
  }
  
  // Scanner RSSI Bluetooth
  scanRSSI();
  
  // Mettre à jour le niveau de batterie
  updateBatteryLevel();
  
  delay(1000);
}

void initCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  // Qualité d'image
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // Initialiser la caméra
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Erreur initialisation caméra: 0x%x\n", err);
    return;
  }
  
  Serial.println("📸 Caméra initialisée avec succès");
}

void initWiFi() {
  WiFi.begin(ssid, password);
  
  Serial.print("🔗 Connexion WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("✅ Connecté au WiFi: ");
  Serial.println(WiFi.localIP());
}

void initBluetooth() {
  SerialBT.begin("ESP32_RSSI_Device"); // Nom Bluetooth
  Serial.println("🔵 Bluetooth initialisé");
}

void initGPS() {
  // Initialiser le GPS si connecté (exemple avec SoftwareSerial)
  // Code à adapter selon votre module GPS
  Serial.println("🛰️ Initialisation GPS...");
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi non connecté");
    return;
  }

  // Créer le document JSON
  DynamicJsonDocument doc(1024);
  doc["deviceId"] = deviceId;
  doc["memberId"] = memberId;
  doc["rssi"] = currentRSSI;
  doc["battery"] = batteryLevel;
  doc["timestamp"] = getTimestamp();
  
  // Ajouter les coordonnées GPS si disponibles
  if (lastLocation != "") {
    doc["location"] = lastLocation;
  }

  String jsonString;
  serializeJson(doc, jsonString);

  // Envoyer au serveur
  HTTPClient http;
  http.begin(serverUrl + String("/sensor-data"));
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.printf("📡 Données envoyées: %d\n", httpResponseCode);
  } else {
    Serial.printf("❌ Erreur envoi données: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
}

void captureAndSendImage() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi non connecté");
    return;
  }

  // Capturer une image
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Erreur capture image");
    return;
  }

  // Encoder en base64
  String encodedImage = base64::encode(fb->buf, fb->len);
  esp_camera_fb_return(fb); // Libérer la mémoire

  // Créer le document JSON
  DynamicJsonDocument doc(4096);
  doc["deviceId"] = deviceId;
  doc["memberId"] = memberId;
  doc["image"] = encodedImage;
  doc["rssi"] = currentRSSI;
  doc["battery"] = batteryLevel;
  doc["timestamp"] = getTimestamp();
  
  if (lastLocation != "") {
    doc["location"] = lastLocation;
  }

  String jsonString;
  serializeJson(doc, jsonString);

  // Envoyer au serveur
  HTTPClient http;
  http.begin(serverUrl + String("/upload-image"));
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.printf("📸 Image envoyée: %d (%d bytes)\n", httpResponseCode, fb->len);
  } else {
    Serial.printf("❌ Erreur envoi image: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
}

void scanRSSI() {
  // Scanner les dispositifs Bluetooth nearby et calculer le RSSI moyen
  // Ceci est un exemple - adaptez selon vos besoins spécifiques
  
  // Simulation de RSSI (remplacez par votre vrai scan Bluetooth)
  currentRSSI = -60.0 - (random(0, 40)); // RSSI entre -60 et -100 dBm
  
  Serial.printf("📶 RSSI actuel: %.2f dBm\n", currentRSSI);
}

void updateBatteryLevel() {
  // Lire le niveau de batterie (adapté selon votre configuration)
  // Exemple avec lecture analogique
  int rawValue = analogRead(A0);
  batteryLevel = map(rawValue, 0, 4095, 0, 100);
  batteryLevel = constrain(batteryLevel, 0, 100);
  
  Serial.printf("🔋 Batterie: %d%%\n", batteryLevel);
}

String getTimestamp() {
  // Obtenir le timestamp actuel (nécessite synchronisation NTP)
  unsigned long epochTime = millis() / 1000;
  return String(epochTime);
}

// Fonctions de gestion des erreurs
void handleWiFiDisconnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("🔄 Reconnexion WiFi...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\n✅ WiFi reconnecté");
  }
}

// Watchdog pour éviter les plantages
void watchdogSetup() {
  // Configurer le watchdog timer
  esp_task_wdt_init(10, true); // Timeout de 10 secondes
  esp_task_wdt_add(NULL);
}

void feedWatchdog() {
  esp_task_wdt_reset();
}
