import React, { useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { FAB } from 'react-native-paper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ScriptCard from '../../components/ScriptCard';
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
  Scripts,
  Title,
  ScriptList,
  LogoutButton,
  LoadContainer,
  Form,
  Fields,
  SearchButtonIcon,
  SearchButton,
} from './styles';
import { useAuth } from '../../hooks/auth';
import theme from '../../global/styles/theme';
import { InputForm } from '../../components/Form/InputForm';

export interface DataListProps {
  id: string;
  title: string;
  text: string;
  date: string;
}

interface FormData {
  search: string;
}

const schema = Yup.object().shape({
  search: Yup.string(),
});

export function Dashboard() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [speeches, setSpeeches] = useState<DataListProps[]>([]);
  const [savedSpeeches, setSavedSpeeches] = useState<DataListProps[]>([]);

  const dataKey = `@promakerapp:script_user:${user.id}`;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleSearch(form: FormData) {
    const { search } = form;
    if (search === '') {
      setSpeeches(savedSpeeches);
    } else {
      const smallCapsSearch = search.toLowerCase();
      const filterSpeeches = savedSpeeches.filter(
        el =>
          el.title.toLowerCase().includes(smallCapsSearch) ||
          el.text.toLowerCase().includes(smallCapsSearch),
      );
      setSpeeches(filterSpeeches);
    }
    Keyboard.dismiss();
  }

  async function loadSpeeches() {
    const response = await AsyncStorage.getItem(dataKey);
    const speechesSaved = response ? JSON.parse(response) : [];
    const speechesFormatted: DataListProps[] = speechesSaved.map(
      (speech: DataListProps) => {
        const date = format(new Date(speech.date), 'MM/dd/yyyy');
        return {
          id: speech.id,
          title: speech.title,
          text: speech.text,
          date,
        };
      },
    );

    console.log('speechesFormatted', speechesFormatted);
    setSpeeches(speechesFormatted);
    setSavedSpeeches(speechesFormatted);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadSpeeches();
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
                  <UserName>{user.name ? user.name : 'User'}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <Form>
              <Fields>
                <InputForm
                  name="search"
                  control={control}
                  placeholder="Title, script, etc..."
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  error={errors.search && errors.search.message}
                />
                <SearchButton onPress={handleSubmit(handleSearch)}>
                  <SearchButtonIcon name="search" />
                </SearchButton>
              </Fields>
            </Form>
          </HighlightCards>
          <Scripts>
            <Title>List</Title>
            <ScriptList
              data={speeches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ScriptCard data={item} />}
            />
          </Scripts>
        </>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Speech')}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: theme.colors.secondary,
    margin: 16,
    right: 16,
    bottom: 24,
  },
});
