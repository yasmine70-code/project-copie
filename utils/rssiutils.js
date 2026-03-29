export function rssiToDistance(rssi) {
  const txPower = -59; // RSSI à 1 mètre
  const n = 2; // facteur environnement

  return Math.pow(10, (txPower - rssi) / (10 * n)).toFixed(2);
}