import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../constants/api";
import {styles } from "../../assets/styles/create.style"
import { COLORS } from '../../constants/colors';


const CATEGORIES = [
    { id: 'food', name: 'Food & Drinks', icon: 'fast-food-outline' },
    { id: 'shopping', name: 'Shopping', icon: 'cart-outline' },
    { id: 'transportation', name: 'Transportation', icon: 'car-outline' },
    { id: 'entertainment', name: 'Entertainment', icon: 'film-outline' },
    { id: 'bills', name: 'Bills', icon: 'receipt-outline' },
    { id: 'income', name: 'Income', icon: 'cash-outline' },
    { id: 'others', name: 'Others', icon: 'ellipsis-horizontal-outline' },
];

const Create = () => {
    const router = useRouter();
    const { user } = useUser();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return Alert.alert("Error", "Please enter a transition title");

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Error", "Please enter a valid amount ");
            return;
        }

        if (!selectedCategory) return Alert.alert("Error", "Please select a category")
        try {
            const formattedAmount = isExpense
                ? -Math.abs(parseFloat(amount))
                : Math.abs(parseFloat(amount));

            const response = await fetch(`(API_URL)/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    title,
                    amount: formattedAmount,
                    category: selectedCategory
                })
            })
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create transaction")
            }
            Alert.alert("Success", "Transaction created successfully");
            router.back();
        } catch (error) {
             Alert.alert("Error", error.message || "Failed to create transaction");
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={()=> router.back()}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.text}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity 
                style={[styles.saveButtonContainer , isLoading && styles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                >
                    <Text style={styles.saveButton}>
                        {isLoading? "saving ..." : "Save"}
                    </Text>
                    {
                        !isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary}/>
                    }
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default Create;
