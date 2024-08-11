import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { getRecentExpenses, getBalance } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const HomePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigation = useNavigation(); // Use the useNavigation hook

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const recentExpenses = await getRecentExpenses();
        setExpenses(recentExpenses);
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
          <Text style={styles.balanceText}>Total Balance: {balance}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Remaining Balance: {balance}</Text>
        </View>
      </View>
      <View style={styles.recentExpensesContainer}>
        <Text style={styles.recentExpensesText}>Recent Expenses of Past 7:</Text>
      </View>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.expenseContainer} 
            onPress={() => navigation.navigate('EditExpense', { expense: item })} // Navigate to EditExpense page with the item data
          >
            <View style={styles.expenseInfoContainer}>
              {item.itemName ? (
                <Text style={styles.expenseText}>Item Name: {item.itemName}</Text>
              ) : null}
              {item.date ? (
                <Text style={styles.expenseText}>Date: {item.date}</Text>
              ) : null}
              {item.expenseAmount ? (
                <Text style={styles.expenseText}>Expense Amount: {item.expenseAmount}</Text>
              ) : null}
              {item.description ? (
                <Text style={styles.expenseText}>Description: {item.description}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
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
    borderRadius : 15,
    borderWidth : 2,
    borderColor : Colors.Gray,
    alignItems : 'center',
    marginBottom: 20,
    height : 100,
  },
  balanceContainer: {
    backgroundColor: Colors.Gray,
    padding: 10,
    borderRadius: 10,
  },
  balanceText: {
    fontSize: 16,
    color: Colors.White,
    fontFamily : fonts.PoppinsRegular,
  },
  recentExpensesContainer: {
    backgroundColor: Colors.Gray,
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  recentExpensesText: {
    fontSize :18,
    color: Colors.White, 
    fontFamily : fonts.PoppinsRegular,
  },
  expenseContainer: {
    borderColor : Colors.Gray,
    borderWidth : 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  expenseInfoContainer: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: Colors.Black,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default HomePage;
