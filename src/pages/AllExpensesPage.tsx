import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import ExpensesList from '../components/ExpenseList';
import { fonts } from '../utils/fonts';
import Balance from '../components/Balance';
import { getAllExpenses } from '../utils/Database/db';
import { ScrollView } from 'react-native-virtualized-view';

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
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchDataIfNeeded = async () => {
    if (isDataChanged) {
      try {
        const fetchedExpenses = await getAllExpenses();
        setExpenses((Expenses) => [Expenses,fetchedExpenses]);
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
    <ScrollView >
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Balance />
      </View>
      <View style={styles.ListContainer}>
        <Text style={styles.ListContainerText}>All Expenses</Text>
        <ExpensesList expenses={expenses} />
      </View>
    </View>
    </ScrollView>
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
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
  },
  ListContainerText: {
    fontSize: 23,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  ListContainer: {
    flex: 1,
    top: 20,
    padding: 15,
    margin: -20,
  },
});

export default AllExpensesPage;