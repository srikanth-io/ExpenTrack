import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getBalance, saveBalance } from '../utils/Database/db';

const BalanceManager: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newBalance, setNewBalance] = useState<string>('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance || 0);
      } catch (error) {
        console.error('Error fetching balance:', error);
        Alert.alert('Error', 'Failed to fetch balance.');
      }
    };

    fetchBalance();
  }, []);

  const handleOpenModal = () => setModalVisible(true);

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewBalance('');
  };

  const handleAddBalance = async () => {
    const newBalanceValue = parseFloat(newBalance);
    if (isNaN(newBalanceValue) || newBalanceValue <= 0) {
      Alert.alert('Validation Error', 'Balance amount must be greater than 0.');
      return;
    }

    try {
      const updatedBalance = balance + newBalanceValue;
      await saveBalance(updatedBalance);
      setBalance(updatedBalance);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating balance:', error);
      Alert.alert('Error', 'Failed to update balance.');
    }
  };

  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceText}>Remaining Balance: ₹ {balance.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addBalanceButton} onPress={handleOpenModal}>
        <Text style={styles.addBalanceButtonText}>Add Balance</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Balance</Text>
            <TextInput
              style={styles.modalInput}
              value={newBalance}
              onChangeText={text => setNewBalance(text.replace(/[^0-9.]/g, ''))}
              keyboardType="number-pad"
              placeholder="₹0.0"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>❌ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddBalance}>
                <Text style={styles.modalButtonText}>✔️ Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.Dark_Teal,
    padding: 15,
    borderRadius: 15,
  },
  balanceText: {
    color: Colors.Background_Color,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
    fontSize: 18,
  },
  addBalanceButton: {
    backgroundColor: Colors.Background_Color,
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  addBalanceButtonText: {
    color: Colors.Dark_Teal,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.Background_Color,
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: 18,
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderColor: Colors.Dark_Green,
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.Dark_Green,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: Colors.Background_Color,
    fontFamily: fonts.PoppinsRegular,
  },
});

export default BalanceManager;
