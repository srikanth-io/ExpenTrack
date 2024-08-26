import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { getBalanceHistory, getExpenseHistory } from '../utils/Database/db';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Balance from '../components/Balance';
import AllEntries from '../components/AllEntries';
import { fonts } from '../utils/fonts';
import { Colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Assuming you have a types file for navigation

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'EditTransactions'>;

type Entry = {
  id: string | any;
  itemName?: string;
  date: string;
  amount?: number;
  description?: string;
  category?: string;
  type: 'income' | 'expense' | 'balance';
};

const HomePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const navigation = useNavigation<HomePageNavigationProp>();

  const fetchDataIfNeeded = async () => {
    try {
      const [balanceEntries, expenseEntries]: [Entry[], Entry[]] = await Promise.all([
        getBalanceHistory(),
        getExpenseHistory(),
      ]);

      // Combine and sort the entries by date
      const combinedEntries = [...balanceEntries, ...expenseEntries].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setEntries(combinedEntries);

      console.log('Home Data fetched successfully!'); // Log success message
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch Home data.'); // Show alert on error
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.Teal} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} nestedScrollEnabled={true}>
        <View style={styles.headerContainer}>
          <Balance />
        </View>
        <IncomeAndExpense />
        <View style={styles.listContainer}> 
          <Text style={styles.listContainerText}>Recent Transactions</Text>
          <AllEntries entries={entries} onPress={() => navigation.navigate('EditTransactions')} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
    position: 'static',
    flex: 1,
    padding: 15,
    top: -75,
  },
  listContainerText: {
    fontSize: 23,
    marginBottom: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;
