// components/Expenses.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/colors';
import { getAllExpenses } from '../utils/Database/db'; 
import { Expense } from './EditExpense';
import { type } from '../utils/types';
import { fonts } from '../utils/fonts';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesData = await getAllExpenses();
setExpenses(prevExpenses => [...prevExpenses, ...expensesData]);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);


  const renderItem = ({ item }: { item: type.Expense }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.textContainer}>
        <Text style={styles.itemHead}>{item.itemName}</Text>
        <Text style={styles.itemDescription}>{item.date}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.containerAmount}>
        <Text style={styles.itemTextAmount}>${item.expenseAmount.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderItem}
keyExtractor={(item: Expense) => item.id?.toString() ?? '0'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
    padding: 20,
  },
  textContainer: {
    padding: 20,
    backgroundColor: Colors.Light_Red,
    marginBottom: 10,
    justifyContent : 'center',
    borderRadius: 10,
  },
  itemHead: {
    fontSize: 20,
    color: Colors.Red,
    fontFamily : fonts.PoppinsSemiBold,
},
itemDescription: {
    fontSize: 16,
    fontFamily : fonts.PoppinsSemiBold,
    color: Colors.Red,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Red,
  },
  containerAmount : {
    flex : 1,
    alignItems : 'flex-end',
    right: 0,
    width : '90%',
    top : 20,
    justifyContent: 'center',
  },
  itemTextAmount : {
    fontSize : 30,
    color : Colors.Text_Color,

  }
});

export default Expenses;
