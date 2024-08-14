import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Colors } from '../utils/colors'
import { fonts } from '../utils/fonts'


const IncomeAndExpense = () => {
  return (
    <View style = {styles.amountsContainer}>
        <TouchableOpacity style = {styles.IncExpContainer}>
        <Image style ={{ tintColor: Colors.Third_color, height: 50, width: 50 }} source={require('../../assets/CustomIcons/income.png') }/>
        <View>
        <Text style={styles.IncomeAmountsText}>Income</Text>
        <Text style={styles.IncomeAmounts}>₹ 1000</Text>
        </View>
        
        </TouchableOpacity>
        <TouchableOpacity style = {styles.IncExpContainer}>
        <Image style ={{ tintColor: Colors.Top_color, height: 50, width: 50 }} source={require('../../assets/CustomIcons/expense.png')} />
        <View>
        <Text style ={styles.ExpenseAmountText}>Expense</Text>
        <Text style ={styles.ExpenseAmount}>₹ 3000</Text>    
        </View>
        </TouchableOpacity>
    </View>
  )
}

export default IncomeAndExpense

const styles = StyleSheet.create({
    amountsContainer : {
        flexDirection : 'row',
        gap : 20,
        alignItems : 'center',
        justifyContent: 'space-evenly', 
        marginBottom : 20,
      },
    IncExpContainer: {
        flexDirection : 'row',
        gap : 10,
        backgroundColor : Colors.Second_color,
        padding :15,
        borderRadius : 20,
      },
      IncomeAmountsText :{ 
        fontSize : 18,
        color : Colors.Bottom_color,
      },
      IncomeAmounts : {
        fontSize : 25,
        color : Colors.Dark100,
        fontFamily : fonts.PoppinsBold,
      },
      ExpenseAmountText :{ 
        fontSize : 18,
        color : Colors.Background_Color,
      },
      ExpenseAmount : {
        fontSize : 25,
      },
})