import { ScrollView, StyleSheet, Text, View } from "react-native";
import Imageslider from "./Imageslider";
import Map from "./Map";
import SOSbutton from "./Sosbutton";
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

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <Imageslider />
      </View>

      {/* SOS Button */}
      
      <SOSbutton />
      {/* Info Text */}
      <Text style={styles.helperText}>
        Press the SOS button to alert your emergency contacts instantly.
      </Text>

      <View style={styles.mapContainer}>
        < Map />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FF0000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  sliderContainer: {
    width: "90%",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 3,
  },
  mapContainer: {
    width: "90%",
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 40,
    backgroundColor: "#f5f5f5",
  },
  sosButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  sosButton: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: "#FF0000",
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
  helperText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    width: "80%",
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});