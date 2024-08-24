import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getExpenseHistory, updateTotalExpense } from '../utils/Database/db';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { formatAmount } from '../utils/FormatAmount';

type Expense = {
  id: string | any;
  itemName: string;
  date: string;
  expenseAmount: number;
  description?: string;
  category?: string;
};

const ExpenseHistory: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await getExpenseHistory();

        // Calculate total amount
        const total = fetchedExpenses.reduce((sum, expense) => sum + (expense.expenseAmount || 0), 0);
        setTotalAmount(total);

        // Update Firestore with total expense
        await updateTotalExpense(total);

        // Sort expenses by date and time in descending order (newest first)
        const sortedExpenses = fetchedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(sortedExpenses);
      } catch (error) {
        console.error('Error fetching expense history:', error);
      }
    };

    fetchExpenses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity style={styles.historyItem} >
      <View style={styles.ItemContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.itemName}</Text>
        </View>
        <View style={styles.DateHistoryContainer}>
          <Text style={styles.DateHistoryText}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={styles.bankContainer}>
          <Text style={styles.bankHistoryText}>{item.category || 'No Category'}</Text>
        </View>
        <View style={styles.DescriptionContainer}>
          <Text style={styles.DescriptionText}>{item.description || 'No Description'}</Text>
        </View>
      </View>
      <View style={styles.HistoryAmountContainer}>
        <Text style={styles.AmountHistoryText}>₹ {formatAmount(item.expenseAmount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
      <ScrollView nestedScrollEnabled={true}>
    <View style={styles.container}>
        <FlatList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
    </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
    padding: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  historyItem: {
    backgroundColor: Colors.Light_Red,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 10,
    position: 'relative',
  },
  ItemContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  nameContainer: {},
  bankContainer: {},
  DateHistoryContainer: {},
  DescriptionContainer: {},
  nameText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Red,
    fontSize: 22,
  },
  DateHistoryText: {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Red,
    fontSize: 18,
  },
  HistoryAmountContainer: {
    position: 'absolute',
    right: 30,
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AmountHistoryText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Red,
    fontSize: 25,
  },
  bankHistoryText: {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Red,
    fontSize: 18,
  },
  DescriptionText: {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Red,
    fontSize: 16,
  },
});

export default ExpenseHistory;
