import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { getBalanceHistory, getExpenseHistory } from '../utils/Database/db';
import AllEntries from '../components/AllEntries';
import { fonts } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/ToastMessages';
import { Colors } from '../utils/colors';

type Entry = {
  id: string;
  itemName?: string;
  date: string;
  amount?: number;
  description?: string;
  category?: string;
  type: 'income' | 'expense' | 'balance';
};

const AllTransactionsPage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const fetchDataIfNeeded = async () => {
    try {
      const [balanceEntries, expenseEntries] = await Promise.all([
        getBalanceHistory(),
        getExpenseHistory(),
      ]);

      // Combine and sort data by date
      const combinedEntries = [...balanceEntries, ...expenseEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Debugging: log fetched data
      // console.log('Combined Entries:', combinedEntries);

      setEntries(combinedEntries);

      Toast.show({
        type: 'successToast',
        text1: 'Data fetched!',
        position: 'top',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      Toast.show({
        type: 'errorToast',
        text1: 'Failed to fetch data.',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);

  // console.log('Entries in AllTransactionsPage:', entries);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
        <View style={styles.listContainer}>
          <Text style={styles.listContainerText}>All Transactions</Text>
          <AllEntries entries={entries} />
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
    zIndex: 1,

  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    flex: 1,
    padding: 15,
  },
  listContainerText: {
    fontSize: 23,
    marginBottom : 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  toast: {
    zIndex: 1000,  
  },
});

export default AllTransactionsPage;
