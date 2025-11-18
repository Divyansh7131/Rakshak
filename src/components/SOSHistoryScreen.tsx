import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";


type SOSItem = {
  id: string;
  timestamp: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  media: string[];
};

export default function SOSHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [sosHistory, setSosHistory] = useState<SOSItem[]>([]);

  useEffect(() => {
    const fetchSOSHistory = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem("loggedInUser");
        if (!storedUser) {
          Alert.alert("Error", "User not found in storage.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const res = await fetch(
          `https://rakshak-gamma.vercel.app/api/sos-alert/user/${user.id}`
        );
        const data = await res.json();

        if (data.success && data.sosHistory) {
          setSosHistory(data.sosHistory.reverse()); // latest first
        } else {
          Alert.alert("Error", data.message || "Failed to fetch SOS history");
        }
      } catch (err) {
        console.error("Fetch SOS history error:", err);
        Alert.alert("Error", "Something went wrong while fetching SOS history");
      } finally {
        setLoading(false);
      }
    };

    fetchSOSHistory();
  }, []);

  const openMap = (lat: number, lng: number) => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open map");
        }
      })
      .catch((err) => console.error("Map open error:", err));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={{ color: "#FF0000", marginTop: 10 }}>Loading SOS history...</Text>
      </View>
    );
  }

  if (sosHistory.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "#555" }}>No SOS history found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: SOSItem }) => (
    <View
      style={[
        styles.item,
        { borderLeftColor: item.status === "active" ? "#FF6347" : "#888" },
      ]}
    >
      {/* Status */}
      <Text style={[styles.status, { color: item.status === "active" ? "#FF6347" : "#888" }]}>
        {item.status.toUpperCase()}
      </Text>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {item.timestamp} | {new Date(item.timestamp).toLocaleString()}
      </Text>

      {/* Location coordinates */}
      <Text style={styles.location}>
        Latitude: {item.location.lat.toFixed(4)}, Longitude: {item.location.lng.toFixed(4)}
      </Text>

      {/* Map preview */}
      <TouchableOpacity onPress={() => openMap(item.location.lat, item.location.lng)}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: item.location.lat,
            longitude: item.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{ latitude: item.location.lat, longitude: item.location.lng }}
            pinColor={item.status === "active" ? "red" : "gray"}
          />
        </MapView>
      </TouchableOpacity>

      {/* Media previews */}
      {item.media.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {item.media.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS History</Text>
      <FlatList
        data={sosHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    backgroundColor: "#fdfdfd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
  },
  status: { fontSize: 16, fontWeight: "bold" },
  timestamp: { fontSize: 14, color: "#555", marginTop: 5 },
  location: { fontSize: 14, color: "#555", marginTop: 3 },
  map: { width: "100%", height: 150, marginTop: 10, borderRadius: 10 },
});
