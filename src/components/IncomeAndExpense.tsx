import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Colors } from '../utils/colors'
import { fonts } from '../utils/fonts'


const IncomeAndExpense = () => {
  return (
    <View style = {styles.amountsContainer}>
      <TouchableOpacity style = {styles.IncExpContainer}>
        <TouchableOpacity style = {styles.IncContainer}>
        <Image style ={{ tintColor: Colors.Teal, height: 50, width: 50 }} source={require('../../assets/CustomIcons/income.png') }/>
        <View>
        <Text style={styles.IncomeAmountsText}>Income</Text>
        <Text style={styles.IncomeAmounts}>₹ 1000</Text>
        </View>
        
        </TouchableOpacity>
        <TouchableOpacity style = {styles.ExpContainer}>
        <Image style ={{ tintColor: Colors.Red, height: 50, width: 50 }} source={require('../../assets/CustomIcons/expense.png')} />
        <View>
        <Text style ={styles.ExpenseAmountText}>Expense</Text>
        <Text style ={styles.ExpenseAmount}>₹ 3000</Text>    
        </View>
        </TouchableOpacity>
        </TouchableOpacity>
    </View>
  )
}

export default IncomeAndExpense

const styles = StyleSheet.create({
      amountsContainer : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent: 'space-around', 
      },
      IncExpContainer: {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 20,
        gap : 30,
        borderRadius : 20,
      },
      IncContainer : {
        flexDirection : 'row',
        backgroundColor : Colors.Pale_Teal,
        justifyContent : 'center',
        padding : 15,
        gap : 5,
        borderRadius : 20,
      },
      ExpContainer : {
        flexDirection : 'row',
        backgroundColor : Colors.Light_Red,
        justifyContent : 'center',
        padding : 15,
        gap : 5,
        borderRadius : 20,
      },
      IncomeAmountsText :{ 
        fontSize : 18,
        color : Colors.Teal,
        fontFamily : fonts.PoppinsSemiBold,
      },
      IncomeAmounts : {
        fontSize : 25,
        color : Colors.Teal,
        fontFamily : fonts.PoppinsBold,
      },
      ExpenseAmountText :{ 
        fontSize : 18,
        color : Colors.Red,
        fontFamily : fonts.PoppinsSemiBold,
      },
      ExpenseAmount : {
        fontSize : 25,
        color : Colors.Red,
        fontFamily : fonts.PoppinsBold,
      },
})