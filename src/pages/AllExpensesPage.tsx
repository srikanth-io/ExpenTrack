// AllExpensesPage.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import ExpensesList from '../components/ExpenseList';
import { fonts } from '../utils/fonts';
import Balance from '../components/Balance';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Profile from '../components/profile&Notification';

const AllExpensesPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Balance />
      </View>
      <View style={{top : -70, left : 10}}>
        <Profile />
      </View>
      {/* <RecentExpenses /> */}
      <View style ={styles.ListContainer}>
        <Text style = {styles.ListContainerText}>All Expenses</Text>
      <ExpensesList/>
      </View>
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
    marginTop : -100,
    borderRadius : 20,
    marginLeft : -20,
    marginRight : -20,
  }
});


export default AllExpensesPage;
