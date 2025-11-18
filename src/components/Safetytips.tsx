import { default as AsyncStorage } from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const tipsData = {
  Home: [
    {
      id: 1,
      en: {
        title: "Always Share Your Location",
        description:
          "Share your live location with a trusted contact whenever you’re home alone or feel unsafe.",
      },
      hi: {
        title: "हमेशा अपनी लोकेशन शेयर करें",
        description:
          "जब भी आप अकेले हों या असुरक्षित महसूस करें, अपनी लोकेशन किसी भरोसेमंद व्यक्ति को भेजें।",
      },
    },
    {
      id: 2,
      en: {
        title: "Keep Emergency Contacts Handy",
        description:
          "Save local police, neighbors, and family contacts for quick access in emergencies.",
      },
      hi: {
        title: "आपातकालीन नंबर पास रखें",
        description:
          "आपात स्थिति के लिए पुलिस, पड़ोसी और परिवार के नंबर फोन में सेव रखें।",
      },
    },
    {
      id: 3,
      en: {
        title: "Lock Doors and Windows Properly",
        description:
          "Before sleeping or leaving home, ensure all doors and windows are locked securely.",
      },
      hi: {
        title: "दरवाजे और खिड़कियाँ बंद रखें",
        description:
          "सोने या बाहर जाने से पहले सुनिश्चित करें कि सभी दरवाजे और खिड़कियाँ सुरक्षित रूप से बंद हैं।",
      },
    },
  ],
  Travel: [
    {
      id: 4,
      en: {
        title: "Check Vehicle Details Before Boarding",
        description:
          "Always verify the cab number and driver’s name. Share your trip with someone you trust.",
      },
      hi: {
        title: "कभी भी गाड़ी में बैठने से पहले जानकारी जांचें",
        description:
          "कैब नंबर और ड्राइवर का नाम चेक करें और अपनी यात्रा की जानकारी किसी भरोसेमंद व्यक्ति को भेजें।",
      },
    },
    {
      id: 5,
      en: {
        title: "Avoid Late-Night Travel Alone",
        description:
          "Try to avoid traveling alone at night. If necessary, use well-lit main roads.",
      },
      hi: {
        title: "रात में अकेले यात्रा न करें",
        description:
          "संभव हो तो रात में अकेले यात्रा से बचें। जरूरत पड़ने पर रोशनी वाले मुख्य मार्ग का ही उपयोग करें।",
      },
    },
    {
      id: 6,
      en: {
        title: "Use Public Transport Safely",
        description:
          "Prefer sitting near other passengers or near the driver’s cabin for safety.",
      },
      hi: {
        title: "सार्वजनिक परिवहन में सुरक्षित रहें",
        description:
          "सुरक्षा के लिए अन्य यात्रियों या ड्राइवर के पास बैठने का प्रयास करें।",
      },
    },
  ],
  Digital: [
    {
      id: 7,
      en: {
        title: "Avoid Sharing Personal Info Online",
        description:
          "Do not share private information or live location on social media platforms.",
      },
      hi: {
        title: "ऑनलाइन अपनी निजी जानकारी साझा न करें",
        description:
          "सोशल मीडिया पर अपनी लाइव लोकेशन या निजी जानकारी साझा न करें।",
      },
    },
    {
      id: 8,
      en: {
        title: "Enable Two-Factor Authentication",
        description:
          "Protect your accounts by enabling two-factor authentication wherever possible.",
      },
      hi: {
        title: "टू-फैक्टर ऑथेंटिकेशन चालू करें",
        description:
          "जहाँ संभव हो, अपने खातों को टू-फैक्टर ऑथेंटिकेशन से सुरक्षित करें।",
      },
    },
    {
      id: 9,
      en: {
        title: "Be Cautious of Unknown Links",
        description:
          "Never click on suspicious links or download unknown attachments.",
      },
      hi: {
        title: "अज्ञात लिंक से सावधान रहें",
        description:
          "संदिग्ध लिंक या अज्ञात अटैचमेंट्स पर कभी क्लिक न करें।",
      },
    },
  ],
  Workplace: [
    {
      id: 10,
      en: {
        title: "Stay Alert and Aware",
        description:
          "Be aware of your surroundings and avoid isolated areas during late hours.",
      },
      hi: {
        title: "सतर्क और जागरूक रहें",
        description:
          "अपने आसपास के माहौल के प्रति सतर्क रहें और देर रात सुनसान जगहों से बचें।",
      },
    },
    {
      id: 11,
      en: {
        title: "Trust Your Instincts",
        description:
          "If you feel uncomfortable around someone, keep your distance and inform HR or security.",
      },
      hi: {
        title: "अपनी भावना पर भरोसा करें",
        description:
          "अगर कोई व्यक्ति असहज महसूस कराता है, तो दूरी बनाए रखें और HR या सुरक्षा टीम को सूचित करें।",
      },
    },
    {
      id: 12,
      en: {
        title: "Know Exit Routes and Security Points",
        description:
          "Familiarize yourself with office exits and security personnel locations.",
      },
      hi: {
        title: "निकास मार्ग और सुरक्षा बिंदु जानें",
        description:
          "ऑफिस में निकास मार्गों और सुरक्षा कर्मियों के स्थानों से परिचित रहें।",
      },
    },
  ],
};

export default function SafetyTipsScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    (async () => {
      const savedFavs = await AsyncStorage.getItem("favoriteTips");
      const savedTheme = await AsyncStorage.getItem("themeMode");
      const savedLang = await AsyncStorage.getItem("langMode");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedTheme === "dark") setDarkMode(true);
      if (savedLang === "hi") setLanguage("hi");
    })();
  }, []);

  const saveFavorites = async (newFavs: number[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem("favoriteTips", JSON.stringify(newFavs));
  };

  const toggleFavorite = (id: number) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    saveFavorites(newFavs);
  };

  // const toggleTheme = async () => {
  //   const newTheme = !darkMode;
  //   setDarkMode(newTheme);
  //   await AsyncStorage.setItem("themeMode", newTheme ? "dark" : "light");
  // };

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    await AsyncStorage.setItem("langMode", newLang);
  };



  const theme = {
    background: darkMode ? "#121212" : "#fff",
    text: darkMode ? "#E0E0E0" : "#222",
    box: darkMode ? "#1E1E1E" : "#FCE4EC",
    title: darkMode ? "#F06292" : "#880E4F",
    desc: darkMode ? "#B39DDB" : "#4A148C",
    accent: darkMode ? "#BB86FC" : "#E91E63",
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.accent }]}>
          {language === "en" ? "Women Safety Tips" : "महिला सुरक्षा टिप्स"}
        </Text>

        <View style={styles.toggles}>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={{ color: theme.text, marginRight: 12 }}>
              {language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
            </Text>
          </TouchableOpacity>
          {/* <Switch value={darkMode} onValueChange={toggleTheme} /> */}
        </View>
      </View>


      <TouchableOpacity
        style={[
          styles.safePlaceButton,
          { backgroundColor: "#1976D2", alignContent: "center", justifyContent: "center" },
        ]}
        onPress={() =>
          Linking.openURL(
            "https://www.google.com/maps/search/Police+Station+near+me"
          )
        }
      >
        <Text style={styles.buttonText}>
          📍{" "}
          {language === "en"
            ? "Nearby Safe Places"
            : "सुरक्षित स्थान"}
        </Text>
      </TouchableOpacity>

      {Object.entries(tipsData).map(([category, tips]) => (
        <View key={category}>
          <Text style={[styles.category, { color: theme.title }]}>
            {category}
          </Text>
          {tips.map((tip) => (
            <View
              key={tip.id}
              style={[styles.tipBox, { backgroundColor: theme.box }]}
            >
              <View style={styles.tipHeader}>
                <Text style={[styles.title, { color: theme.title }]}>
                  {tip[language].title}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(tip.id)}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: favorites.includes(tip.id) ? "#E91E63" : "#999",
                    }}
                  >
                    {favorites.includes(tip.id) ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.description, { color: theme.desc }]}>
                {tip[language].description}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.listenButton,
                    { backgroundColor: theme.accent },
                  ]}
                  onPress={() =>
                    Speech.speak(tip[language].description, { language })
                  }
                >
                  <Text style={styles.buttonText}>
                    🔈 {language === "en" ? "Listen" : "सुनें"}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16,marginTop:10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggles: { flexDirection: "row", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginTop: 25 },
  category: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  tipBox: { marginBottom: 20, padding: 12, borderRadius: 10 },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4, flex: 1 },
  description: { fontSize: 14, marginBottom: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  listenButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  safePlaceButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontSize: 13 },
  emergencyButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
});