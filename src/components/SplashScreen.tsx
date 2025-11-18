import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/rakshak.png')} // relative path to your image
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Rakshak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 28, 
    fontWeight: 'bold',
  },
});