import React, { useState } from "react";
import { Alert, Linking, TouchableOpacity, Text, StyleSheet, View } from "react-native";


export default function SendEmergencyButton() {
  const [isRecording, setIsRecording] = useState(false);

  // Send text SOS
  const sendTextSOS = async () => {
    try {
      const message = encodeURIComponent(
        "🚨 I need help! This is my current location: https://www.google.com/maps/search/?api=1&query=My+Location"
      );
      const whatsappURL = `whatsapp://send?text=${message}`;
      const smsURL = `sms:?body=${message}`;

      Alert.alert(
        "Send Emergency Alert",
        "Choose where to send the SOS message:",
        [
          { text: "📱 WhatsApp", onPress: () => Linking.openURL(whatsappURL) },
          { text: "✉️ SMS", onPress: () => Linking.openURL(smsURL) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Unable to open messaging apps.");
    }
  };

 

  return (
    <View>
      {/* Text SOS button */}
      <TouchableOpacity style={styles.button} onPress={sendTextSOS}>
        <Text style={styles.text}>🚨 Send Emergency Message</Text>
      </TouchableOpacity>

     
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#FF0000",
    marginHorizontal: 50,
    marginVertical:10,
     paddingVertical: 14,
  },
  recording: {
    backgroundColor: "#D32F2F",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
