import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Simulate a database
let mockDatabase = [
    {
        id: '1',
        itemName: 'Groceries',
        date: new Date(2024, 7, 8),
        expenseAmount: '2000',
        description: 'Weekly groceries',
    },
    {
        id: '2',
        itemName: 'Electricity Bill',
        date: new Date(2024, 7, 5),
        expenseAmount: '1500',
        description: 'Monthly electricity bill',
    },
];

const AddExpenses = ({ mode = 'add', existingData = {}, onSave, onCancel }) => {
    const [date, setDate] = useState(existingData.date || new Date());
    const [itemName, setItemName] = useState(existingData.itemName || '');
    const [expenseAmount, setExpenseAmount] = useState(existingData.expenseAmount || '');
    const [description, setDescription] = useState(existingData.description || '');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        // If mode is 'edit' and existingData is provided, initialize state
        if (mode === 'edit' && existingData) {
            setDate(existingData.date || new Date());
            setItemName(existingData.itemName || '');
            setExpenseAmount(existingData.expenseAmount || '');
            setDescription(existingData.description || '');
        }
    }, [mode, existingData]);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = () => {
        const expenseData = {
            id: existingData.id || new Date().toISOString(), // Generate a unique ID for new entries
            itemName,
            date,
            expenseAmount,
            description,
        };

        // Simulate adding or updating expense in "database"
        if (mode === 'edit') {
            mockDatabase = mockDatabase.map(expense =>
                expense.id === existingData.id ? expenseData : expense
            );
        } else {
            mockDatabase.push(expenseData);
        }

        console.log('Updated Database:', mockDatabase); // Log to check
        onSave && onSave(expenseData);
    };

    const handleClear = () => {
        setItemName('');
        setExpenseAmount('');
        setDescription('');
        setDate(new Date());
    };

    const handleCancel = () => {
        onCancel && onCancel();
    };

    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>Balance: Rs.10000</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Item Name:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setItemName}
                    value={itemName}
                />

                <Text style={styles.label}>Date:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text>{date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.label}>Expense Amount:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setExpenseAmount}
                    value={expenseAmount}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    onChangeText={setDescription}
                    value={description}
                    multiline={true}
                    maxLength={500}
                />
            </View>

            <View style={styles.buttonContainer}>
                {mode === 'add' ? (
                    <TouchableOpacity style={styles.button} onPress={handleClear}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddExpenses;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    balanceContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    balanceText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
