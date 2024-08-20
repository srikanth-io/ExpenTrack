import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalanceHistory } from '../utils/Database/db';

const BalanceHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const balanceHistory = await getBalanceHistory();
        console.log('Fetched balance history:', balanceHistory); // Log data to inspect structure
        setHistory(balanceHistory);
      } catch (error) {
        console.error('Error fetching balance history:', error);
      }
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.historyText}>Name: {item.name}</Text>
      <Text style={styles.historyText}>Amount: ₹ {item.amount.toFixed(2)}</Text>
      <Text style={styles.historyText}>Category: {item.category}</Text>
      <Text style={styles.historyText}>Bank: {item.bank}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.historyTitle}>Balance History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Fallback to index if id is undefined
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
  historyTitle: {
    fontSize: 18,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Text_Color,
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  historyText: {
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Dark_Green,
    fontSize: 14,
  },
});

export default BalanceHistory;
