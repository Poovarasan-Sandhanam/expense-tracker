import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { styles } from "../assets/styles/home.styles";
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useRouter } from 'expo-router';

const NoTransactionFound = () => {
  const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons name="file-tray-outline"  style={styles.emptyStateIcon} size={60} color={COLORS.textLight} />
      <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
      <Text style={styles.emptyStateText}>
        Your recent transactions will appear here once added.
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
        <Ionicons name='add-circle' size={18} color={COLORS.white}/>
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionFound;

