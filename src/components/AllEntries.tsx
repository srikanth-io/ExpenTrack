import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBalanceHistory, getExpenseHistory } from '../utils/Database/db';
import { formatAmount } from '../utils/FormatAmount';
import { fonts } from '../utils/fonts';
import { Colors } from '../utils/colors';

// Define types if using TypeScript
type Entry = {
  type: string;
  id: string;
  name?: string;
  date: string;
  bank?: string;
  amount?: number;
  itemName?: string;
  category?: string;
  description?: string;
  expenseAmount?: number;
};

const AllEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceHistory, expenseHistory] = await Promise.all([
          getBalanceHistory(),
          getExpenseHistory(),
        ]);

        // Map and format data
        const formattedBalanceHistory = balanceHistory.map((item: any) => ({
          id: item.id, // Ensure `id` is available
          name: item.name,
          date: new Date(item.date).toLocaleDateString(),
          bank: item.bank,
          amount: item.amount,
        }));

        const formattedExpenseHistory = expenseHistory.map((item: any) => ({
          id: item.id, // Ensure `id` is available
          itemName: item.itemName,
          date: new Date(item.date).toLocaleDateString(),
          category: item.category || 'No Category',
          description: item.description || 'No Description',
          expenseAmount: item.expenseAmount,
        }));

        // Combine and sort entries by date (newest first)
        const combinedEntries = [
          ...formattedBalanceHistory.map(item => ({ ...item, type: 'income' })),
          ...formattedExpenseHistory.map(item => ({ ...item, type: 'expense' })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setEntries(combinedEntries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to add a new entry (to simulate new data entry)
  const addNewEntry = (entry: Entry) => {
    setEntries(prevEntries => [entry, ...prevEntries]);
  };

  const renderItem = ({ item }: { item: Entry }) => {
    // Determine styles based on entry type
    const textColor = item.type === 'income' ? Colors.Teal : Colors.Red;
    const amountColor = item.type === 'income' ? Colors.Teal : Colors.Red;
    const isExpense = item.type === 'expense';

    return (
      <TouchableOpacity style={[styles.historyItem, { backgroundColor: isExpense ? Colors.palest_Light_Red : Colors.palest_Light_Teal }]}>
        <View style={styles.ItemContainer}>
          <View style={styles.nameContainer}>
            <Text style={[styles.nameText, { color: textColor, fontFamily: fonts.PoppinsSemiBold }]}>
              {item.name || item.itemName}
            </Text>
          </View>
          <View style={styles.DateHistoryContainer}>
            <Text style={[styles.DateHistoryText, { color: textColor, fontFamily: fonts.PoppinsSemiBold }]}>
              {item.date}
            </Text>
          </View>
          <View style={styles.bankContainer}>
            <Text style={[styles.bankHistoryText, { color: textColor, fontFamily: fonts.PoppinsSemiBold }]}>
              {item.bank || item.category}
            </Text>
          </View>
          {item.type === 'expense' && (
            <View style={styles.DescriptionContainer}>
              <Text style={[styles.DescriptionText, { color: textColor, fontFamily: fonts.PoppinsSemiBold }]}>
                {item.description}
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.HistoryAmountContainer, { flexDirection: isExpense ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.AmountHistoryText, { color: amountColor, fontFamily: fonts.PoppinsSemiBold }]}>
            ₹ {formatAmount(item.amount || item.expenseAmount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  historyItem: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  ItemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 23,
  },
  DateHistoryContainer: {
    flex: 1,
  },
  DateHistoryText: {
    fontSize: 18,
  },
  bankContainer: {
    flex: 1,
  },
  bankHistoryText: {
    fontSize: 18,
  },
  DescriptionContainer: {
    flex: 1,
  },
  DescriptionText: {
    fontSize: 16,
  },
  HistoryAmountContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    top: '50%',
  },
  AmountHistoryText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default AllEntries;
