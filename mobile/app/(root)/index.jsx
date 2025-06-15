import { useEffect } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '../../components/SignOutButton'
import { useTransactions } from '../../hook/useTransactions';
import PageLoader from '../../components/PageLoader';
import { styles } from '../../assets/styles/home.styles';
import {Ionicons} from "@expo/vector-icons"
import { useRoute } from '@react-navigation/native';
import BalanceCard from '../../components/BalanceCard';


export default function Page() {
  const { user } = useUser();
  const router = useRoute();
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  )

  useEffect(() => {
    loadData();
  }, [loadData])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* <Image src={require("")}
              style={styles.headerLogo}
              resizeMode="contain"
            /> */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Welcome,
              </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={()=> router.push("/create")}>
              <Ionicons name ="add" size={20} color ="#FFF"/>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            <SignOutButton/>
          </View>
  
        </View>
          <BalanceCard summary={summary}/>
      </View>

      <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionsListContent}
      data={transactions}
      renderItem={({item})}
      />
    </View>
  )
}