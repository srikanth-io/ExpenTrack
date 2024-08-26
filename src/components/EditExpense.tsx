import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditExpense = () => {
  const route = useRoute();
  const { entry } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Expense</Text>
      <Text>ID: {entry?.id}</Text>
      <Text>Item Name: {entry?.itemName}</Text>
      <Text>Date: {new Date(entry?.date).toLocaleString()}</Text>
      <Text>Category: {entry?.category}</Text>
      <Text>Description: {entry?.description}</Text>
      <Text>Amount: ₹ {entry?.expenseAmount}</Text>
      <Button title="Save" onPress={() => {/* Handle save logic */}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default EditExpense;
