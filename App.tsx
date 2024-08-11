import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import DashboardPage from './src/pages/DashboardPage';
import SplashScreen from './src/pages/SplashScreen';
import TabNavigator from './src/pages/TabNaviagator';
import AddExpenses from './src/pages/AddExpenses';
import { Colors } from './src/utils/colors';
import { fonts } from './src/utils/fonts';
import EditExpense from './src/pages/EditExpense';


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
      <Stack.Navigator initialRouteName="SplashScreen"  screenOptions={{
                    headerTitleAlign: 'center',  
                    headerStyle: {
                        backgroundColor: Colors.White, 
                    },
                    headerTitleStyle: {
                        fontFamily : fonts.PoppinsRegular,
                        fontWeight: 'bold',
                    },
                    ...TransitionPresets.SlideFromRightIOS, 
                }}>
        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'} }} />
        <Stack.Screen name="AddExpenses" component={AddExpenses} options={{ headerShown: true, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'}, headerTitle: 'Add Expenses' }} />
        <Stack.Screen name="EditExpense" component={EditExpense} options={{ headerShown: true, headerTitleStyle : { fontFamily : fonts.PoppinsRegular, fontWeight : 'bold'}, headerTitle: 'Edit Expenses' }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

async function loadFontsAndDependencies() {

  await new Promise(resolve => setTimeout(resolve, 3000)); 
}
