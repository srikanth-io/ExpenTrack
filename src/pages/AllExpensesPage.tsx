import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllExpenses, getBalance } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { fonts } from '../utils/fonts';

interface Expense {
  id?: string | number ;
  itemName?: string ;
  date?: string | null;
  expenseAmount?: number;
  description?: string;
}

const AllExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const navigation = useNavigation<any>(); 
  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await getAllExpenses();
        setExpenses(allExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const balance = await getBalance();
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchExpenses();
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Remaining Balance: ₹ {balance}</Text>
        </View>
      </View>
      <View style={styles.recentExpensesContainer}>
        <Text style={styles.recentExpensesText}>All Expenses:</Text>
      </View>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.expenseContainer} 
            onPress={() => navigation.navigate('EditExpense', { expense: item })}
          >
            <View style={styles.expenseInfoContainer}>
              {item.itemName && (
                <Text style={styles.expenseText}>Item: {item.itemName}</Text>
              )}
              {item.date && (
                <Text style={styles.expenseText}>Date: {item.date}</Text>
              )}
              {item.expenseAmount !== undefined && (
                <Text style={styles.expenseText}>Expense Amount: {item.expenseAmount}</Text>
              )}
              {item.description && (
                <Text style={styles.expenseText}>Description: {item.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
    backgroundColor: Colors.Gray,
  },
  balanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: fonts.PoppinsBold,
  },
  recentExpensesContainer: {
    backgroundColor: Colors.Gray,
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  recentExpensesText: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
  },
  expenseContainer: {
    borderColor: Colors.Gray,
    backgroundColor: Colors.Gray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseInfoContainer: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default AllExpensesPage;
