import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { initializeDatabase, saveExpense } from "../utils/Database/db";

interface AddExpensesNavigationProp {
  navigation: any;
}

const MIN_ITEM_NAME_LENGTH = 2;

const AddExpenses: React.FC<AddExpensesNavigationProp> = ({ navigation }) => {

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const now = new Date();
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState(now);
  const [formattedDate, setFormattedDate] = useState(formatDate(now));
  const displayDate = formattedDate || "Select Date";
  const [expenseAmount, setExpenseAmount] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleSave = async () => {
    if (itemName.length < MIN_ITEM_NAME_LENGTH) {
      Alert.alert(
        "Validation Error",
        `Item name must contain at least ${MIN_ITEM_NAME_LENGTH} characters.`
      );
      return;
    }

    if (!date) {
      Alert.alert("Validation Error", "Please select a date.");
      return;
    }

    const expenseAmountValue = parseFloat(expenseAmount);
    if (isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
      Alert.alert("Validation Error", "Expense amount must be greater than 0.");
      return;
    }

    const expense = {
      itemName,
      date: formattedDate,
      expenseAmount: expenseAmountValue,
      description,
      image: image ? image.uri : null,
    };

    try {
      await initializeDatabase(); // Initialize the database
      await saveExpense(expense);

      Alert.alert("Success", "Expense saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);

      setItemName("");
      setDate(now);
      setFormattedDate(formatDate(now));
      setExpenseAmount("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error saving expense:", error);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event.type === "set" && selectedDate) {
      // Prevent selecting future dates
      if (selectedDate > now) {
        Alert.alert("Invalid Date", "Future dates are not allowed.");
        return;
      }
      setDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
    }
  };

  const handleDatePickerPress = () => setShowDatePicker(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.RemainingBalance}>
          <Text>Remaining Balance</Text>
          <View style={styles.RemainingBalanceAmount}></View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Enter item name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={handleDatePickerPress}
            >
              <Text style={styles.datePickerText}>{displayDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={now} // Set the maximum date to today
              />
            )}
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={expenseAmount}
              onChangeText={(text) =>
                setExpenseAmount(text.replace(/[^0-9.]/g, ""))
              }
              keyboardType="number-pad"
              placeholder="Expense amount"
            />
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.DesInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description here..."
              multiline
            />
          </View>
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePick}
            >
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
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
  RemainingBalance: {},
  RemainingBalanceAmount: {},
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input: {
    height: 55,
    backgroundColor: Colors.Light_Teal,
    borderRadius: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Cool_Blue,
  },
  DesInput: {
    height: 150,
    backgroundColor: Colors.Light_Teal,
    borderRadius: 15,
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: Colors.Cool_Blue,
    textAlignVertical: 'top',
    padding: 10,
  },
  datePickerButton: {
    backgroundColor: Colors.Light_Teal,
    padding: 15,
    borderRadius: 15,
  },
  datePickerText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
    color: Colors.Dark_Green,
  },
  imagePickerButton: {
    backgroundColor: Colors.Light_Teal,
    padding: 10,
    borderRadius: 15,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
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

export default AddExpenses;
