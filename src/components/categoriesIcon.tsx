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
      case 'entertainment':
        return 'tv-outline';
      case 'health':
        return 'medkit-outline';
      case 'education':
        return 'school-outline';
      case 'travel':
        return 'airplane-outline';
      default:
        return 'help-outline';
    }
  };

  const getIconColor = () => {
    switch (category) {
      case 'income':
        return Colors.Dark_Green;
      case 'food':
      case 'transport':
      case 'shopping':
      case 'entertainment':
      case 'health':
      case 'education':
      case 'travel':
        return Colors.Light_Red;
      default:
        return Colors.Text_Color;
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name={getIconName()} size={24} color={getIconColor()} />
      {/* <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text> */}
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
