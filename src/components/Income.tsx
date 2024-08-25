import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalanceHistory } from '../utils/Database/db';
import { formatAmount } from '../utils/FormatAmount';

type BalanceEntry = {
  id: string | any;
  name: string;
  date: string; 
  amount: number;
  bank: string;
};

const BalanceHistory: React.FC = () => {
  const [history, setHistory] = useState<BalanceEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const balanceHistory = await getBalanceHistory();

        // Sort entries by date and time in descending order (newest first)
        const sortedHistory = balanceHistory.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        console.assert('Fetched balance history:', JSON.stringify(sortedHistory));
        setHistory(sortedHistory);
      } catch (error) {
        console.error('Error fetching balance history:', error);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }: { item: BalanceEntry }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.ItemContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.DateHistoryContainer}>
          <Text style={styles.DateHistoryText}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.bankContainer}>
          <Text style={styles.bankHistoryText}>{item.bank}</Text>
        </View>
      </View>
      <View style={styles.HistoryAmountContainer}>
        <Text style={styles.AmountHistoryText}>₹ {formatAmount(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    flexGrow: 1,
  },
  historyItem: {
    backgroundColor: Colors.Pale_Teal,
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
  nameText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Teal,
    fontSize: 22,
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
  bankHistoryText: {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Teal,
    fontSize: 18,
  },
});

export default BalanceHistory;