import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../utils/colors';

interface CategoryIconProps {
  category: string;
  amount: number;
  isExpense: boolean;
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
        return null;
    }
  };

  const getIconBackgroundColor = () => {
    switch (category) {
      case 'food':
        return Colors.Food_Background;
      case 'transport':
        return Colors.Transport_Background;
      case 'shopping':
        return Colors.Shopping_Background;
      case 'income':
        return Colors.Income_Background;
      case 'entertainment':
        return Colors.Entertainment_Background;
      case 'health':
        return Colors.Health_Background;
      case 'education':
        return Colors.Education_Background;
      case 'travel':
        return Colors.Travel_Background;
      default:
        return Colors.Default_Background;
    }
  };

  const getIconColor = () => {
    switch (category) {
      case 'income':
        return Colors.Income_Icon;
      case 'food':
        return Colors.Food_Icon;
      case 'transport':
        return Colors.Transport_Icon;
      case 'shopping':
        return Colors.Shopping_Icon;
      case 'entertainment':
        return Colors.Entertainment_Icon;
      case 'health':
        return Colors.Health_Icon;
      case 'education':
        return Colors.Education_Icon;
      case 'travel':
        return Colors.Travel_Icon;
      default:
        return Colors.Default_Icon;
    }
  };

  const iconName = getIconName();
  const iconBackgroundColor = getIconBackgroundColor();
  const iconColor = getIconColor();

  return (
    <View style={[styles.container, { backgroundColor: iconBackgroundColor }]}>
      {iconName ? (
        <Ionicons name={iconName} size={30} color={iconColor} />
      ) : (
        <Image source={require('../../assets/Broken_image.png')} style={styles.brokenIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brokenIcon: {
    width: 30,
    height: 30,
  },
});

export default CategoryIcon;
