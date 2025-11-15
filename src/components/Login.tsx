import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

export default function Login({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  const url = "https://rakshak-gamma.vercel.app/api/auth/signin";

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password!");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok || !result.success) {
        Alert.alert("Error", result.message || "Login failed");
        return;
      }

      await AsyncStorage.setItem("loggedInUser", JSON.stringify(result.user));
      Alert.alert("Success", "Sign-in successful!");
      navigation.replace("MainApp");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while logging in.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.ibb.co/YWBgMpC/red-gradient-bg.jpg" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.form}>
          <Text style={styles.head}>Rakshak</Text>
          <Text style={styles.subtitle}>Your Safety, Our Priority</Text>

          {/* Phone number input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#bbb"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Password input with show/hide */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#bbb"
                secureTextEntry={showPassword} // ✅ Corrected logic
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye" : "eye-slash"} // ✅ Fixed icons
                  type="font-awesome"
                  color="#C30000"
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <Pressable style={styles.submit} onPress={handleLogin}>
            <Text style={styles.submitText}>Login</Text>
          </Pressable>

          {/* Register link */}
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>
              New user? <Text style={styles.linkHighlight}>Register here</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  head: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "800",
    color: "#C30000",
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: "center",
    color: "#444",
    fontSize: 14,
    marginBottom: 30,
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#C30000",
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C30000",
    paddingHorizontal: 12,
    color: "#333",
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C30000",
    paddingHorizontal: 10,
    height: 45,
  },
  passwordInput: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },
  eyeButton: {
    paddingHorizontal: 4,
  },
  submit: {
    backgroundColor: "#C30000",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#C30000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#C30000",
    fontWeight: "700",
  },
});