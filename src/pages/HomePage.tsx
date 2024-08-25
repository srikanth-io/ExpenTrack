import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { getBalanceHistory, getExpenseHistory } from '../utils/Database/db';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Balance from '../components/Balance';
import AllEntries from '../components/AllEntries';
import { fonts } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/ToastMessages';
import { Colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming you have a types file for navigation

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'EditTransactions'>;

type Entry = {
  id: string;
  itemName?: string;
  date: string;
  amount?: number;
  description?: string;
  category?: string;
  type: 'income' | 'expense' | 'balance';
};

const HomePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const navigation = useNavigation<HomePageNavigationProp>();

  const fetchDataIfNeeded = async () => {
    try {
      const [balanceEntries, expenseEntries]: [Entry[], Entry[]] = await Promise.all([
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} nestedScrollEnabled={true}>
        <View style={styles.headerContainer}>
          <Balance />
        </View>
        <IncomeAndExpense />
        <TouchableOpacity
          style={styles.listContainer}
          onPress={() => navigation.navigate('EditTransactions')} 
        >
          <Text style={styles.listContainerText}>Recent Transactions</Text>
          <AllEntries entries={entries}  onPress={() => navigation.navigate('EditTransactions')}/>
        </TouchableOpacity>
      </ScrollView>
      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position : 'relative',
    flex: 1,
    backgroundColor: Colors.Background_Color,
  },
  scrollViewContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  listContainer: {
    position : 'static',
    flex: 1,
    padding: 15,
    top: '-2.5%',
  },
  listContainerText: {
    fontSize: 23,
    marginBottom : 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
});

export default HomePage;
