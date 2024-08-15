import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAllExpenses } from '../utils/Database/db'; 
import { type } from '../utils/types';
import CategoryIcon from '../components/categoriesIcon'; 
import { Colors } from '../utils/colors';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<type.Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExpenses = await getAllExpenses();
        setExpenses(allExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchData();
  }, []);
  

  const renderItem = ({ item }: { item: type.Expense }) => (
    <View style={styles.itemContainer}>
        <View style={styles.amountContainer}>
        <CategoryIcon 
          category={item.category}
          amount={item.expenseAmount}
          isExpense={item.expenseAmount < 0} 
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.itemTextHead}>{item.itemName}</Text>
        <Text style={styles.itemText}>{item.date}</Text>
      </View>
      
    </View>
  );

  return (
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>No expenses available.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.Light_Teal, 
    padding: 20,
    marginVertical: 8,
    borderRadius: 20, 
    flexDirection: 'row', 
  },
  textContainer: {
    paddingLeft : 10,
    justifyContent : 'center',
    },
    itemTextHead: {
    fontSize: 20,
    alignItems : 'center',
    color: Colors.Text_Color, 
    },
    itemText: {
    fontSize: 16,
    alignItems : 'center',
    color: Colors.Text_Color, 
  },
  amountContainer: {
    alignItems: 'center',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.Text_Color,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.Text_Color,
  },
});

export default ExpensesList;
