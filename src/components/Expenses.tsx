import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getAllExpenses } from '../utils/Database/db'; 
import { type } from '../utils/types';
import CategoryIcon from '../components/categoriesIcon'; 
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { useNavigation } from '@react-navigation/native';
import EditExpense from './EditExpense';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<type.Expense[]>([]);
  const navigation = useNavigation();

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


  const handlePress = (expense: type.Expense) => {
    navigation.navigate(EditExpense, { expense });
  };

  const renderItem = ({ item }: { item: type.Expense }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      <View style={styles.amountContainer}>
        <CategoryIcon 
          category={item.category} amount={0} isExpense={false}        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.itemTextHead}>{item.itemName}</Text>
        <Text style={styles.itemText}>{item.date}</Text>
      </View>
      
      <View style={styles.containerAmount}>
        <Text style={styles.itemTextAmount}>₹ {item.expenseAmount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: Colors.Light_Red, 
    padding: 15,
    top : 15,
    marginVertical: 5,
    borderRadius: 20, 
    flexDirection: 'row', 
    margin :15,
  },
  textContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  itemTextHead: {
    fontSize: 23,
    fontFamily : fonts.PoppinsSemiBold,
    color: Colors.Red,
  },
  itemText: {
    fontSize: 16,
    fontFamily : fonts.PoppinsSemiBold,
    color: Colors.Dark_Green, 
  },
  amountContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontFamily : fonts.PoppinsSemiBold,
    textAlign: 'center',
    color: Colors.Text_Color,
  },
  containerAmount : {
    flex : 1,
    alignItems : 'flex-end',
    right: 0,
    width : '90%',
    justifyContent: 'center',
  },
  itemTextAmount : {
    fontSize : 23,
    fontFamily : fonts.PoppinsSemiBold,
    color : Colors.Red,
  }
});

export default ExpensesList;
