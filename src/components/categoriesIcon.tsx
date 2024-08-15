import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../utils/colors';

interface CategoryIconProps {
  category: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  const getIconName = () => {
    switch (category) {
      case 'food':
        return 'fast-food-outline';
      case 'transport':
        return 'car-outline';
      case 'shopping':
        return 'cart-outline';
      case 'income':
        return 'wallet-outline';
      default:
        return 'help-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name={getIconName()} size={24} color={Colors.Text_Color} />
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    backgroundColor: Colors.Background_Color,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 18,
    color: Colors.Text_Color,
  },
});

export default CategoryIcon;
