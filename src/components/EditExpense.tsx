import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { updateExpense, getBalance } from "../utils/Database/db";
import Balance from "./Balance";

export interface Expense {
  category: string;
  id?: number;
  itemName: string;
  date?: string;
  expenseAmount: number;
  description?: string;
  image?: string;
}

interface EditExpenseProps {
  route: {
    params: {
      expense: Expense;
    };
  };
  navigation: any;
}

const EditExpense: React.FC<EditExpenseProps> = ({ route, navigation }) => {
  const { expense } = route.params;

  const [itemName, setItemName] = useState<string>(expense.itemName || "");
  const [date, setDate] = useState<Date>(new Date(expense.date || Date.now()));
  const [formattedDate, setFormattedDate] = useState<string>(
    expense.date || new Date().toLocaleDateString()
  );
  const [expenseAmount, setExpenseAmount] = useState<string>(
    expense.expenseAmount.toString() || ""
  );
  const [description, setDescription] = useState<string>(
    expense.description || ""
  );
  const [image, setImage] = useState<{ uri: string } | null>(
    expense.image ? { uri: expense.image } : null
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance || 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
        Alert.alert("Error", "Failed to fetch balance.");
      }
    };

    fetchBalance();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleSave = async () => {
    const updatedExpenseAmount = parseFloat(expenseAmount);

    if (isNaN(updatedExpenseAmount) || updatedExpenseAmount <= 0) {
      Alert.alert("Validation Error", "Expense amount must be greater than 0.");
      return;
    }

    if (updatedExpenseAmount > balance) {
      Alert.alert("Limit Exceeded", "Insufficient balance.");
      return;
    }

    
    const updatedExpense: Expense = {
      id: expense.id,
      itemName,
      date: formattedDate,
      expenseAmount: updatedExpenseAmount,
      description,
      image: image?.uri || undefined,
      category: ""
    };

    try {
      await updateExpense(updatedExpense);
      Alert.alert("Success", "Expense updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating expense:", error);
      Alert.alert("Error", "Failed to update expense.");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    setFormattedDate(currentDate.toLocaleDateString());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Balance/>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Item Name"
          />
          <View style={styles.space} />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {formattedDate || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <View style={styles.space} />

          <TextInput
            style={styles.input}
            value={expenseAmount}
            onChangeText={(text) =>
              setExpenseAmount(text.replace(/[^0-9.]/g, ""))
            }
            keyboardType="number-pad"
            placeholder="₹ 0.0"
          />
          <View style={styles.space} />

          <TextInput
            style={styles.inputDes}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline={true}
          />

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handleImagePick}
          >
            <Text style={styles.imagePickerText}>Add Picture</Text>
            {image && <Image source={{ uri: image.uri }} style={styles.selectedImage} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSave}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.space} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_Color,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    top : -40,
    justifyContent: "center",
  },
  space: {
    height: 15,
  },
  input: {
    height: 60,
    backgroundColor: Colors.Pale_Teal,
    paddingHorizontal : 15,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
  },
  inputDes: {
    height: 150,
    backgroundColor: Colors.Pale_Teal,
    borderRadius: 15,
    paddingHorizontal : 15,
    paddingTop: 15,
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: Colors.Dark_Teal,
    textAlignVertical: "top",
    padding: 10,
    marginBottom : 15,
  },
  datePickerButton: {
    height : 60,
    backgroundColor: Colors.Pale_Teal,
    justifyContent : 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  datePickerText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
    color: Colors.Dark_Teal,
  },
  imagePickerButton: {
    backgroundColor: Colors.Light_Teal,
    padding: 40,
    justifyContent : 'center',
    borderRadius: 15,
    alignItems: "center",
  },
  imagePickerText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 18,
    color: Colors.Dark_Teal,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    height : 60,
    backgroundColor: Colors.Teal,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    color: Colors.Background_Color,
  },
});

export default EditExpense;
