import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getExpenseHistory } from '../utils/Database/db'; 
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { formatAmount } from '../utils/FormatAmount';

type Expense = any;

const ExpenseHistory: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await getExpenseHistory();
        console.assert('Fetched expense history:', JSON.stringify(fetchedExpenses));
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error('Error fetching expense history:', error);
      }
    };

    fetchExpenses();
  }, []);

  const renderItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.ItemContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.itemName}</Text>
        </View>
        <View style={styles.DateHistoryContainer}>
          <Text style={styles.DateHistoryText}>{new Date(item.date).toLocaleDateString()}</Text>
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

const renderHeader = () => {
  return (
    <></>
  );
};

return (
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
    padding: 20,
  },
  ItemContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  nameContainer: {
  },
  bankContainer : {
  },
  DateHistoryContainer : {
  },
  DescriptionContainer : {
  },
  nameText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Teal,
    fontSize: 22,
  },
  historyItem: {
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 10,
    position: 'relative',
  },
  DateHistoryText: {
    fontFamily: fonts.PoppinsRegular, 
    color: Colors.Teal,
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
    color: Colors.Teal,
    fontSize: 25, 
  },
  bankHistoryText : {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Teal,
    fontSize: 18, 
  },
  DescriptionText : {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Teal,
    fontSize: 16, 
  }
});
export default ExpenseHistory;
