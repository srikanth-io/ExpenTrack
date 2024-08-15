// HomePage.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Profile from '../components/profile&Notification';
import Balance from '../components/Balance';

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Balance />
      </View>
      <IncomeAndExpense/>
      <View style={{top : -200, left : 10}}>
        <Profile />
      </View>
      {/* <RecentExpenses /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor : Colors.Background_Color,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
    top : 10,
    marginTop : 20,
  },
});

export default HomePage;
