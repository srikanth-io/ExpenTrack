import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllExpenses, getBalance } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const AllExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);

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
          <Text style={styles.balanceText}>Remaining Balance: {balance}</Text>
        </View>
      </View>
      <View style={styles.recentExpensesContainer}>
        <Text style={styles.recentExpensesText}>All Expenses:</Text>
      </View>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <View style={styles.expenseContainer}>
            <View style={styles.expenseInfoContainer}>
              <Text style={styles.expenseText}>Item Name: {item.itemName}</Text>
              <Text style={styles.expenseText}>Date: {item.date}</Text>
              <Text style={styles.expenseText}>Expense Amount: {item.expenseAmount}</Text>
              <Text style={styles.expenseText}>Description: {item.description}</Text>
            </View>
            <View style={styles.expenseActionsContainer}>
              <TouchableOpacity style={styles.expenseActionButton}>
                <Text style={styles.expenseActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.expenseActionButton}>
                <Text style={styles.expenseActionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.Gray,
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
    borderRadius: 10,
    marginBottom: 20,
  },
  recentExpensesText: {
    fontSize: 18,
    color: Colors.White,
    fontFamily: fonts.PoppinsRegular,
  },
  expenseContainer: {
    borderColor: Colors.Gray,
    color : Colors.White,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: Colors.White,
  },
  expenseInfoContainer: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: Colors.Black,
    fontFamily: fonts.PoppinsRegular,
  },
  expenseActionsContainer: {
    flexDirection: 'row',
  },
  expenseActionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  expenseActionText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily : fonts.PoppinsRegular,
    fontWeight: 'bold',
  },
});

export default AllExpensesPage;