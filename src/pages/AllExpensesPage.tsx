import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import ExpensesList from '../components/ExpenseList';
import { fonts } from '../utils/fonts';
import Balance from '../components/Balance';
import Profile from '../components/profile&Notification';
import { getAllExpenses } from '../utils/Database/db';

type Expense = {
  id: number;
  category: string;
  itemName: string;
  date: string;
  expenseAmount: number;
  description?: string;
  image?: string;
};

let isDataChanged = false;

const AllExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState([]);

  const fetchDataIfNeeded = async () => {
    if (isDataChanged) {
      try {
        const expenses = await getAllExpenses();
        setExpenses(expenses);
        isDataChanged = false; 
      } catch (error) {
        console.error('Error fetching all expenses:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Balance />
      </View>
      <View style={{ top: -66, left: 10 }}>
        <Profile />
      </View>
      <View style={styles.ListContainer}>
        <Text style={styles.ListContainerText}>All Expenses</Text>
        <ExpensesList expenses={expenses} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Background_Color,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    top: 10,
    marginBottom: 20,
    height: 100,
    marginTop: 30,
  },
  ListContainerText: {
    fontSize: 23,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  ListContainer: {
    flex: 1,
    padding: 15,
    marginTop: -100,
    marginLeft: -20,
    marginRight: -20,
  },
});

export default AllExpensesPage;
