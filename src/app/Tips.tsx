
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SafetyTipsScreen from "../components/Safetytips";
export default function Tips() {
    return (
        
              <GestureHandlerRootView style={{ flex: 1 }}>
      <SafetyTipsScreen/>
    </GestureHandlerRootView>
            
       
    );
}