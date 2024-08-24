import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalanceHistory } from '../utils/Database/db';
import { ScrollView } from 'react-native-virtualized-view';
import { formatAmount } from '../utils/FormatAmount';

const BalanceHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const balanceHistory = await getBalanceHistory();
        console.assert('Fetched balance history:', JSON.stringify(balanceHistory));
        setHistory(balanceHistory);
      } catch (error) {
        console.error('Error fetching balance history:', error);
      }
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <ScrollView nestedScrollEnabled={true}>
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.ItemContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
        <View style={styles.DateHistoryContainer}>
        <Text style={styles.DateHistoryText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.bankContainer}>
        <Text style={styles.bankHistoryText}>{item.bank}</Text>
        </View>
        
      </View>
      <View style={styles.HistoryAmountContainer}>
        <Text style={styles.AmountHistoryText}>₹ {formatAmount(item.amount)}</Text>
      </View>
    </TouchableOpacity>
    </ScrollView>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
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
  }
});

export default BalanceHistory;
