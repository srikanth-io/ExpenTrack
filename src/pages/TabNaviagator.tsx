import React from 'react';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Octicons, Entypo, Feather } from '@expo/vector-icons';
import AllExpensesPage from './AllExpensesPage';
import AddExpenses from './AddExpenses';
import HomePage from './HomePage';
import { fonts } from '../utils/fonts';
import { Colors } from './../utils/colors';

type TabBarIconProps = {
  name: any;
  iconSet: 'Octicons' | 'Entypo' | 'Feather';
  size: number;
  color: string;
};
type TabParamList = any;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

const Tab = createBottomTabNavigator();

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, iconSet, size, color }) => {
  let IconComponent;

  switch (iconSet) {
    case 'Octicons':
      IconComponent = Octicons;
      break;
    case 'Entypo':
      IconComponent = Entypo;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    default:
      IconComponent = Octicons;
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          let iconSet: 'Octicons' | 'Entypo' | 'Feather';

          if (route.name === 'Home') {
            iconSet = 'Octicons';
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'AllExpenses') {
            iconSet = 'Entypo';
            iconName = focused ? 'list' : 'list';
          } else {
            iconSet = 'Octicons';
            iconName = 'question';
          }

          return <TabBarIcon name={iconName} iconSet={iconSet} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: fonts.PoppinsRegular,
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          backgroundColor: Colors.Gray,
          borderRadius: 15,
          elevation: 5,
          maxWidth: 400,
          bottom: 15,
          left: 13,
        },
        tabBarActiveTintColor: Colors.White,
        tabBarInactiveTintColor: Colors.AntiqueWhite,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'Home',
        }}
      />
      <Tab.Screen
        name="AllExpenses"
        component={AllExpensesPage}
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'All Expenses',
        }}
      />
      <Tab.Screen
        name="AddExpenses"
        component={AddExpenses}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="plus" size={30} color={Colors.White} />
          ),
          tabBarLabel: '               Add               ',
          tabBarButton: (props) => (
            <TabBarButton {...props} navigation={navigation} />
          ),
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </Tab.Navigator>
  );
};

type TabBarButtonProps = {
  navigation: TabNavigationProp;
} & React.ComponentProps<typeof TouchableOpacity>;

const TabBarButton: React.FC<TabBarButtonProps> = ({ navigation, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        maxWidth: 200,
        backgroundColor: Colors.BlueViolet,
        elevation: 5,
        padding: 5,
      }}
      onPress={() => navigation.navigate('AddExpenses')}
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default TabNavigator;
