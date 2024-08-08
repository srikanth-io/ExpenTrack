import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardPage from './src/pages/DashboardPage';
import SplashScreen from './src/pages/SplashScreen';
import TabNavigator from './src/pages/TabNaviagator';


const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    async function prepare() {
      try {
        await loadFontsAndDependencies(); 

        setTimeout(() => {
          setIsReady(true); 
        }, 1000); 
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false); 
      }
    }

    prepare();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isReady) {
    return null; 
  }

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

async function loadFontsAndDependencies() {

  await new Promise(resolve => setTimeout(resolve, 3000)); 
}
