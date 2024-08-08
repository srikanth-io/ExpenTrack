# Expense Management Application

## Overview

This is an Expense Management application built with React Native. The app allows users to manage their expenses efficiently, with functionalities to add, edit, and delete expenses. It uses SQLite for local data storage.

## Features

- **Add Expenses**: Create new expense entries with details like item name, date, amount, and description.
- **Edit Expenses**: Modify existing expenses.
- **Delete Expenses**: Remove expenses from the list.
- **View Balance**: Track the remaining balance.
- **Image Upload**: Attach images (receipts) to expenses.
- **Local Storage**: Store data locally using SQLite.

## Installation

Follow these steps to set up the project:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd your-repo-name
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Install SQLite dependencies**:

    ```bash
    expo install expo-sqlite
    ```

## Usage

1. **Start the development server**:

    ```bash
    npm start
    ```

   This command will open a new tab in your default web browser with options to run the app on an emulator or physical device.

2. **Open the app**:

   Use Expo Go on your mobile device or an emulator to scan the QR code displayed in the terminal.

## Folder Structure

Here’s a brief overview of the folder structure:

- **`/components`**: Reusable UI components.
- **`/screens`**: Screen components (e.g., AddExpenses, AllExpensesPage).
- **`/database`**: SQLite database utility functions.
- **`/utils`**: Utility functions and constants.
- **`App.js`**: Entry point of the application.

## Example Usage

Here is an example of how to use the `AddExpenses` component:

```jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const AddExpenses = ({ onSave, onCancel }) => {
    // Define your component logic and state here

    return (
        <View>
            <Text>Item Name:</Text>
            <TextInput />
            <Text>Date:</Text>
            <TextInput />
            <Text>Expense Amount:</Text>
            <TextInput />
            <Text>Description:</Text>
            <TextInput />

            <TouchableOpacity onPress={onSave}>
                <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel}>
                <Text>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};
