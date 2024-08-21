import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SplashScreen from './src/pages/SplashScreen';
import TabNavigator from './src/components/TabNavigator';
import AddExpenses from './src/pages/AddExpenses';
import { Colors } from './src/utils/colors';
import { fonts } from './src/utils/fonts';
import ProfileEditorPage from './src/pages/profileEditorPage';
import BalanceManager from './src/components/BalanceManager';
import Toast from 'react-native-toast-message';
import Notification from './src/pages/Notification';
import Income from './src/components/Income';
import Expenses from './src/components/Expenses';
import EditExpense from './src/components/EditExpense';
import { StatusBar } from 'expo-status-bar';
import Login from './src/pages/LoginPage';
import Register from './src/pages/RegisterPage';
import PasswordResetPage from './src/pages/PasswordResetPage';
import { User } from 'firebase/auth';
import { auth } from './src/utils/Auth/fireBaseConfig';

const Stack = createStackNavigator();

export default function App() {
  <StatusBar style="auto" />
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFontsAndDependencies();
        const currentUser = auth.currentUser;
        setUser(currentUser);
        setTimeout(() => setIsReady(true), 3000);
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
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Toast />
      <Stack.Navigator
        initialRouteName={user ? 'Dashboard' : 'Login'}
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.Background_Color,
          },
          headerTitleStyle: {
            fontFamily: fonts.PoppinsRegular,
            fontWeight: 'bold',
          },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={Register} options={{ headerTitle: ' ' }} />
        <Stack.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddExpenses"
          component={AddExpenses}
          options={{
            headerTitleStyle: {
              fontFamily: fonts.PoppinsRegular,
              fontWeight: 'bold',
            },
            headerTitle: 'Add Expenses',
          }}
        />
        <Stack.Screen
          name="ProfileEditor"
          component={ProfileEditorPage}
          options={{
            headerTitleStyle: {
              fontFamily: fonts.PoppinsRegular,
              fontWeight: 'bold',
            },
            headerTitle: 'Profile Page',
          }}
        />
        <Stack.Screen
          name="BalanceManager"
          component={BalanceManager}
          options={{
            headerTitleStyle: {
              fontFamily: fonts.PoppinsRegular,
              fontWeight: 'bold',
            },
            headerTitle: 'Add Balance',
          }}
        />
        <Stack.Screen
          name="ProfileEditorPage"
          component={ProfileEditorPage}
          options={{
            headerTitle: 'Profile',
            headerTitleStyle: {
              fontFamily: fonts.PoppinsRegular,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="PasswordResetPage" component={PasswordResetPage} options={{ headerTitle: ' ' }} />
        <Stack.Screen name="IncomeList" component={Income} options={{ headerTitle: 'Income Logs' }} />
        <Stack.Screen name="ExpensesList" component={Expenses} options={{ headerTitle: 'Expense Logs' }} />
        <Stack.Screen name="EditExpenses" component={EditExpense} options={{ headerTitle: 'Edit Transactions' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

async function loadFontsAndDependencies() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
