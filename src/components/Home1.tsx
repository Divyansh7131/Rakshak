import React from "react";
import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from "react-native";
import SOSButton from "./Sosbutton";
import Map from "./Map";


const { width } = Dimensions.get("window");

export default function Home1() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Rakshak</Text>
        <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
      </View>

      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../Images/Picture3.webp")}
          style={styles.bannerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.bannerTitle}>Stay Safe, Stay Secure</Text>
          <Text style={styles.bannerSubtitle}>
            Emergency alerts and safety tips at your fingertips
          </Text>
        </View>
      </View>

      {/* SOS Button */}
      <SOSButton />

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Press the SOS button to alert your emergency contacts instantly.
      </Text>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <Map />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF0000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  bannerContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    width: "90%",
    marginVertical: 15,
  },
  mapContainer: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 40,
    backgroundColor: "#f5f5f5",
  },
});
