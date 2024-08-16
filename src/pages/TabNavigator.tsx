import React from 'react';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import AllExpensesPage from './AllExpensesPage';
import AddExpenses from './AddExpenses';
import HomePage from './HomePage';
import { fonts } from '../utils/fonts';
import { Colors } from './../utils/colors';

type TabBarIconProps = {
  name: string | any;
  iconSet: 'MaterialCommunityIcons' | 'Entypo' | 'Feather' | 'FontAwesome';
  size: number;
  color: string;
};

type TabParamList = {
  Home: undefined;
  Transaction: undefined;
  AddExpenses: undefined;
  Budget: undefined;
  Profile: undefined;
};
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

const Tab = createBottomTabNavigator<TabParamList>();

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, iconSet, size, color }) => {
  let IconComponent;

  switch (iconSet) {
    case 'MaterialCommunityIcons':
      IconComponent = MaterialCommunityIcons;
      break;
    case 'Entypo':
      IconComponent = Entypo;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    case 'FontAwesome':
      IconComponent = FontAwesome;
      break;
    default:
      IconComponent = MaterialCommunityIcons;
      break;
  }

  return <IconComponent name={name} size={size} color={color} />;
};

type TabNavigatorProps = {
  navigation: TabNavigationProp;
};

const TabNavigator: React.FC<TabNavigatorProps> = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: string;
          let iconSet: 'MaterialCommunityIcons' | 'Entypo' | 'Feather' | 'FontAwesome';

          if (route.name === 'Home') {
            iconSet = 'Entypo';
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Transaction') {
            iconSet = 'Entypo';
            iconName = focused ? 'swap' : 'swap';
          } else if (route.name === 'Budget') {
            iconSet = 'MaterialCommunityIcons';
            iconName = focused ? 'chart-pie' : 'chart-pie';
          } else if (route.name === 'Profile') {
            iconSet = 'FontAwesome';
            iconName = focused ? 'user' : 'user';
          } else {
            iconSet = 'Feather';
            iconName = 'plus';
          }

          return <TabBarIcon name={iconName} iconSet={iconSet} size={24} color={color} />;
        },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'Home') {
            label = 'Home';
          } else if (route.name === 'Transaction') {
            label = 'Transaction';
          } else if (route.name === 'Budget') {
            label = 'Budget';
          } else if (route.name === 'Profile') {
            label = 'Profile';
          } else {
            label = 'Add';
          }
          return <Text style={{ color: focused ? Colors.Dark_Teal : Colors.Light_Teal }}>{label}</Text>;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: fonts.PoppinsRegular,
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: Colors.Dark_Teal,
        tabBarInactiveTintColor: Colors.Light_Teal,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={AllExpensesPage}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AddExpenses"
        component={AddExpenses}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus" size={30} color={Colors.Dark_Green} />
          ),
          tabBarLabel: '',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} navigation={navigation} />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={AllExpensesPage}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomePage}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

type CustomTabBarButtonProps = {
  navigation: TabNavigationProp;
} & React.ComponentProps<typeof TouchableOpacity>;

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ navigation, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={styles.customButtonStyle}
      onPress={() => navigation.navigate('AddExpenses')}
    >
      <Feather name="plus" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 70,
    paddingBottom: 10,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 20,
    elevation: 10,
  },
  customButtonStyle: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.Dark_Green,
    elevation: 5,
  },
});

export default TabNavigator;
