import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.style";
import { COLORS } from '../../constants/colors';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: 'fast-food-outline' },
  { id: 'shopping', name: 'Shopping', icon: 'cart-outline' },
  { id: 'transportation', name: 'Transportation', icon: 'car-outline' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film-outline' },
  { id: 'bills', name: 'Bills', icon: 'receipt-outline' },
  { id: 'others', name: 'Others', icon: 'ellipsis-horizontal-outline' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'cash-outline' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase-outline' },
  { id: 'bonus', name: 'Bonus', icon: 'gift-outline' },
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

  const getFilteredCategories = () => isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleAmountChange = (value) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
  };

  const handleBack = () => {
    if (title || amount || selectedCategory) {
      Alert.alert("Unsaved Changes", "Are you sure you want to go back?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return Alert.alert("Error", "Please enter a valid amount");
    }
    if (!selectedCategory) return Alert.alert("Error", "Please select a category");

    setIsLoading(true);

    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction");
      }

      Alert.alert("Success", "Transaction created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name='arrow-back' size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            (!title || !amount || !selectedCategory || isLoading) && styles.saveButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!title || !amount || !selectedCategory || isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Transaction Card */}
      <View style={styles.card}>
        {/* Expense / Income Toggle */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name='arrow-down-circle'
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text style={[
              styles.typeButtonText,
              isExpense && styles.typeButtonTextActive
            ]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name='arrow-up-circle'
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text style={[
              styles.typeButtonText,
              !isExpense && styles.typeButtonTextActive
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder='0.00'
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType='numeric'
          />
        </View>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Section */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
        </Text>

        <View style={styles.categoryGrid}>
          {getFilteredCategories().map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default Create;
