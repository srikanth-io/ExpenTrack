import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Colors } from '../utils/colors';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Balance from '../components/Balance';
import ExpensesList from '../components/HomeList';
import { fonts } from '../utils/fonts';
import { getAllExpenses } from '../utils/Database/db';
import Toast from 'react-native-toast-message';
import toastConfig from '../components/ToastMessages';

const HomePage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dataChanged, setDataChanged] = useState(true);

  const fetchDataIfNeeded = async () => {
    if (dataChanged) {
      try {
        const fetchedExpenses = await getAllExpenses();
        setExpenses(fetchedExpenses);
        setDataChanged(false);
        Toast.show({
          type: 'successToast',
          text1: 'Data fetched!',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Error fetching expenses:', error);
        Toast.show({
          type: 'errorToast',
          text1: 'Failed to fetch data.',
          position: 'bottom',
        });
      }
    }
  };

  useEffect(() => {
    fetchDataIfNeeded();
  }, [dataChanged]);

  return (
    <ScrollView style={styles.FlexContainerList} nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Balance />
        </View>
        <IncomeAndExpense />
        <View style={styles.listContainer}>
          <Text style={styles.listContainerText}>Recent Expenses</Text>
          <ExpensesList expenses={expenses} />
        </View>
        <Toast config={toastConfig} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,  
    backgroundColor: Colors.Background_Color,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  listContainerText: {
    fontSize: 23,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  listContainer: {
    flex: 1,
    padding: 15,
    margin: -20,
    top: -70,
  },
  FlexContainerList: {
    flexDirection: 'column',
  },
});

export default HomePage;
