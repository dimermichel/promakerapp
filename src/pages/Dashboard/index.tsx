import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components/native';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';

import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({
    entries: {
      amount: '0',
      lastTransaction: '',
    },
    expenses: {
      amount: '0',
      lastTransaction: '',
    },
    total: {
      amount: '0',
      lastTransaction: '',
    },
  } as HighlightData);

  const dataKey = `@promakerapp:transactions_user:${user.id}`;

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative',
  ): string {
    const lastTransaction = Math.max.apply(
      Math,
      collection
        .filter((transaction) => transaction.type === type)
        ?.map((transaction) => new Date(transaction.date).getTime()),
    );
    console.log(lastTransaction);
    return !isFinite(lastTransaction) && isNaN(lastTransaction)
      ? format(new Date(lastTransaction), 'PPP')
      : `${format(new Date(), 'PPP')}`;
  }

  async function loadTransactions() {
    let incomeSum = 0;
    let outcomeSum = 0;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    const transactionsFormatted: DataListProps[] = transactions.map(
      (transaction: DataListProps) => {
        if (transaction.type === 'positive') {
          incomeSum += Number(transaction.amount);
        } else {
          outcomeSum += Number(transaction.amount);
        }

        const amount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(Number(transaction.amount));

        const date = format(new Date(transaction.date), 'MM/dd/yyyy');
        return {
          id: transaction.id,
          name: transaction.name,
          type: transaction.type,
          category: transaction.category,
          amount: `${amount}`,
          date,
        };
      },
    );

    const total = incomeSum - outcomeSum;

    const lastTransactionEntryDate = getLastTransactionDate(
      transactions,
      'positive',
    );
    const lastTransactionExpenseDate = getLastTransactionDate(
      transactions,
      'negative',
    );
    const totalInterval = `01 to ${lastTransactionExpenseDate}`;

    setHighlightData({
      entries: {
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(Number(incomeSum)),
        lastTransaction: `Last entry at ${lastTransactionEntryDate}`,
      },
      expenses: {
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(Number(outcomeSum)),
        lastTransaction: `Last expense at ${lastTransactionExpenseDate}`,
      },
      total: {
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(Number(total)),
        lastTransaction: totalInterval,
      },
    });

    setTransactions(transactionsFormatted);
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Hi,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              type="up"
              title="Income"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Outcome"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>
          <Transactions>
            <Title>List</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
