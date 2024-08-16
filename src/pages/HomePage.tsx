import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Profile from '../components/profile&Notification';
import Balance from '../components/Balance';
import ExpensesList from '../components/ExpenseList';
import { fonts } from '../utils/fonts';

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
      <View style ={styles.ListContainer}>
        <Text style = {styles.ListContainerText}>Recent Expenses</Text>
      <ExpensesList/>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height : '100%',
    backgroundColor : Colors.Background_Color,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    top : 10,
    marginBottom: 20,
    height: 100,
    marginTop : 30,
  },
  ListContainerText : {
    fontSize : 23,
    fontFamily : fonts.PoppinsSemiBold,
    color : Colors.Dark_Teal,
  },
  ListContainer :{
    display : 'flex',
    padding :20,
    marginTop : -110,
    marginLeft : -20,
    marginRight : -20,
  }
});

export default HomePage;
