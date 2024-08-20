import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { Colors } from '../utils/colors';
import IncomeAndExpense from '../components/IncomeAndExpense';
import Balance from '../components/Balance';
import ExpensesList from '../components/ExpenseList';
import { fonts } from '../utils/fonts';
import { getAllExpenses } from '../utils/Database/db';
import Toast, { ToastConfigParams } from 'react-native-toast-message';

interface ToastProps extends ToastConfigParams {
  text1: string;
  text2?: string;
}


const HomePage: React.FC = () => {
  const [expenses, setExpenses] = useState();
  const [dataChanged, setDataChanged] = useState(true); 

  const fetchDataIfNeeded = async () => {
    if (dataChanged) {
      try {
        const fetchedExpenses = await getAllExpenses();
        setExpenses(fetchedExpenses as any);
        setDataChanged(false); 
        Toast.show({
          type: 'successToast',
          text1: 'Data fetched!',
          position: 'top',
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
  <ScrollView style = {styles.FlexContainerList} nestedScrollEnabled={true} >
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Balance />
      </View>
      <IncomeAndExpense />
      <View style={styles.listContainer}>
        <Text style={styles.listContainerText}>Recent Expenses</Text>
        <ExpensesList expenses={expenses} />
      </View>
      <Toast config={toastConfig as any} /> 
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
    top : -70,
  },
  FlexContainerList : {
    flexDirection: "column",
  }
});

// Define the custom toast styles
const customStyles = StyleSheet.create({
  successToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#28a745', 
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#17a2b8', 
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: Colors.Text_Color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: Colors.Text_Color,
    fontSize: 14,
  },
});

const toastConfig = {
  successToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.successToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  errorToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.errorToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
  infoToast: ({ text1, text2 }: ToastProps) => (
    <View style={customStyles.infoToast}>
      <Text style={customStyles.toastText}>{text1}</Text>
      {text2 && <Text style={customStyles.toastSubText}>{text2}</Text>}
    </View>
  ),
};

export default HomePage;
