import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddExpenses = ({ mode = 'add', existingData = {}, onSave, onCancel }) => {
    const [date, setDate] = useState(existingData.date || new Date());
    const [itemName, setItemName] = useState(existingData.itemName || '');
    const [expenseAmount, setExpenseAmount] = useState(existingData.expenseAmount || '');
    const [description, setDescription] = useState(existingData.description || '');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = () => {
        const expenseData = {
            itemName,
            date,
            expenseAmount,
            description,
        };
        onSave(expenseData);
    };

    const handleClear = () => {
        setItemName('');
        setExpenseAmount('');
        setDescription('');
        setDate(new Date());
    };

    const handleCancel = () => {
        onCancel();
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
