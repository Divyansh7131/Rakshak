import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Home1 from "../components/Home1";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
export default function Home() {
    return (
        <ScrollView>
        <SafeAreaView>
        <View>
        <Home1/>
        </View>
        </SafeAreaView>
        </ScrollView>
       
    );
}