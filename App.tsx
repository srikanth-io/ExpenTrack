import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from './src/pages/SplashScreen';
import TabNavigator from './src/components/TabNavigator';
import AddExpenses from './src/pages/AddExpenses';
import { Colors } from './src/utils/colors';
import { fonts } from './src/utils/fonts';
import ProfileEditorPage from './src/pages/profileEditorPage';
import BalanceManager from './src/components/BalanceManager';
import Toast from 'react-native-toast-message';
import RegisterPage from './src/pages/RegisterPage';
import LoginPage from './src/pages/LoginPage';


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
        }, 3000); 
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
      <Toast/>
      <Stack.Navigator initialRouteName="SplashScreen"  screenOptions={{
                    headerTitleAlign: 'center',  
                    headerStyle: {
                        backgroundColor: Colors.Background_Color, 
                    },
                    headerTitleStyle: {
                        fontFamily : fonts.PoppinsRegular,
                        fontWeight: 'bold',
                    },
                    ...TransitionPresets.SlideFromRightIOS, 
                  }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false}} />
        <Stack.Screen name="Registration" component={RegisterPage} options={{ headerShown: false}} />
        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'} }} />
        <Stack.Screen name="AddExpenses" component={AddExpenses} options={{ headerShown: true, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'}, headerTitle: 'Add Expenses' }} />
        <Stack.Screen name="ProfileEditor" component={ProfileEditorPage} options={{ headerShown: true, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'}, headerTitle: 'Profile Page' }} />
        <Stack.Screen name="BalanceManager" component={BalanceManager} options={{ headerShown: true, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'}, headerTitle: 'Add Balance' }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

async function loadFontsAndDependencies() {
  await new Promise(resolve => setTimeout(resolve, 3000)); 
}
