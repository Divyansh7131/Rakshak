import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

const BASE_URL = "https://rakshak-gamma.vercel.app";

export default function SOSbutton() {
  const pulse = useRef(new Animated.Value(1)).current;
  const [isActive, setIsActive] = useState(false);
  const [sosId, setSosId] = useState<string | null>(null);
  const locationInterval = useRef<NodeJS.Timeout | null>(null);

  // Start pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for SOS.");
        return null;
      }
      const loc = await Location.getCurrentPositionAsync({});
      return {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };
    } catch (error) {
      console.error("Location Error:", error);
      return null;
    }
  };

  // Fetch trusted friends
  const fetchTrustedContacts = async (userId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/${userId}/trusted-friends`);
      const data = await res.json();
      return data.friends || [];
    } catch (error) {
      console.error("Error fetching trusted friends:", error);
      return [];
    }
  };

  // Simulate sending SMS/notification
  const notifyTrustedContacts = async (friends: any[], message: string) => {
    friends.forEach((friend: any) => {
      console.log(`📩 Sending SOS message to ${friend.name} (${friend.phone}): ${message}`);
      // Here you can integrate Twilio / Firebase Cloud Messaging / backend notification API
    });
  };

  // Create SOS alert
  const createSOS = async (userId: string, location: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sos-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, location, status: "active" }),
      });
      const data = await response.json();
      if (data.success) {
        setSosId(data.sos.id);
        return data.sos.id;
      }
    } catch (error) {
      console.error("Error creating SOS:", error);
    }
  };

  // Update SOS alert (location or status)
  const updateSOS = async (id: string | null, location: any, status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sos-alert/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, status }),
      });
    //   console.log("AAAAAAAAAAAAAAAAAAAAAA"+ await response.json());
      
      return await response.json();
    } catch (error) {
      console.error("Error updating SOS:", error);
    }
  };

  // Start periodic location updates
  const startLocationUpdates = (id: string) => {
    locationInterval.current = setInterval(async () => {
      const location = await getCurrentLocation();
      if (location) await updateSOS(id, location, "active");
    }, 5 * 60 * 1000) as unknown as NodeJS.Timeout; // every 5 min
  };

  // Stop location updates
  const stopLocationUpdates = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  // Handle SOS button press
  const handleSOS = async () => {
    const userStr = await AsyncStorage.getItem("loggedInUser");
    if (!userStr) return Alert.alert("Error", "User not found in storage");
    const user = JSON.parse(userStr);

    if (!isActive) {
      // === START SOS ===
      const location = await getCurrentLocation();
      if (!location) return;

      const friends = await fetchTrustedContacts(user.id);
      await notifyTrustedContacts(
        friends,
        "🚨 SOS Alert! " + user.username + " might be in danger. Check immediately."
      );

      const id = await createSOS(user.id, location);
      if (id) {
        startLocationUpdates(id);
        setIsActive(true);
        Alert.alert("SOS Activated", "Your SOS alert has been sent.");
      }
    } else {
      // === STOP SOS ===
      const location = await getCurrentLocation();
      await updateSOS(sosId, location, "inactive");
      stopLocationUpdates();
      setIsActive(false);
      setSosId(null);
      Alert.alert("SOS Deactivated", "Your SOS alert has been turned off.");
    }
  };

  return (
    <Animated.View
      style={[styles.sosButtonContainer, { transform: [{ scale: pulse }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.sosButton, { backgroundColor: isActive ? "#777" : "#FF0000" }]}
        onPress={handleSOS}
      >
        <Text style={styles.sosText}>{isActive ? "STOP" : "SOS"}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sosButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  sosButton: {
    height: 150,
    width: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  sosText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 2,
  },
});
