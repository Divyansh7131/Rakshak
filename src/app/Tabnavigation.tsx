import React, { useEffect, useState } from 'react';
import Home from './Home';
import Tips from './Tips';
import TrustedContacts from './Trustedcontacts';
import Profile from './Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Tabnavigation() {
  const [Tab, setTab] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    import('@react-navigation/bottom-tabs')
      .then((mod) => {
        if (mounted) {
          setTab(mod.createBottomTabNavigator());
        }
      })
      .catch((err) => {
        console.error('Failed to load @react-navigation/bottom-tabs:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Tab) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: string = 'help-outline'; // default icon

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tips') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >

      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tips" component={Tips} />
      <Tab.Screen name="Contacts" component={TrustedContacts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
