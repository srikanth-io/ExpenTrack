import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Colors } from '../utils/colors';
import { getAllIncome } from '../utils/Database/db'; 

const Income = () => {
  const [income, setIncome] = useState([]);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const incomeData = await getAllIncome();
        setIncome(incomeData);
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    fetchIncome();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemSource}>{item.source || 'Unknown Source'}</Text>
      <Text style={styles.itemDescription}>{item.description || 'No description'}</Text>
      <Text style={styles.itemAmount}>₹ {item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={income}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  itemContainer: {
    padding: 15,
    backgroundColor: Colors.Pale_Teal,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemSource: {
    fontSize: 16,
    color: Colors.Teal,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.Teal,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Teal,
  },
});

export default Income;
