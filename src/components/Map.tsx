import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,ActivityIndicator,Alert,Platform} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useWebMap, setUseWebMap] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Ask for permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // Load last saved location from AsyncStorage (optional)
        const saved = await AsyncStorage.getItem("lastLocation");
        if (saved) {
          const savedCoords = JSON.parse(saved);
          setLocation({
            latitude: savedCoords.lat,
            longitude: savedCoords.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }

        // Get current position initially
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const initialCoords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(initialCoords);
        await saveLocation(initialCoords);

        // Watch for continuous updates
        const watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000, // every 2 sec
            distanceInterval: 5, // every 5 meters
          },
          async (loc) => {
            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setLocation(coords);
            await saveLocation(coords);
          }
        );

        // For web fallback
        if (Platform.OS === "web") setUseWebMap(true);

        setLoading(false);
        return () => watcher.remove();
      } catch (error) {
        console.error(error);
        setErrorMsg("Error getting location");
        Alert.alert("Error", "Could not fetch location");
        setLoading(false);
      }
    })();
  }, []);

  const saveLocation = async (coords: any) => {
    try {
      await AsyncStorage.setItem(
        "lastLocation",
        JSON.stringify({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      );
    } catch (err) {
      console.log("Error saving location:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9b6fb6" />
        <Text style={styles.text}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Location not available</Text>
      </View>
    );
  }

  // ✅ Web fallback (Google Maps iframe)
  if (useWebMap) {
    const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`;
    return (
      <View style={styles.container}>
        <Text style={styles.coords}>
          Lat: {location.latitude.toFixed(5)} | Lng:{" "}
          {location.longitude.toFixed(5)}
        </Text>
        <WebView source={{ uri: mapUrl }} style={styles.map} />
      </View>
    );
  }

  // ✅ Native map
  return (
    <View style={styles.container}>
      <Text style={styles.coords}>
        Lat: {location.latitude.toFixed(5)} | Lng: {location.longitude.toFixed(5)}
      </Text>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        region={location}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="#9b6fb6"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 10, color: "#666" },
  error: { color: "#ff0000", textAlign: "center", padding: 20 },
  coords: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
    fontWeight: "500",
  },
});