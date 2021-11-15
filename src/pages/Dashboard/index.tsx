import React, { useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Keyboard, View } from 'react-native';
import * as Yup from 'yup';
import { Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { FAB } from 'react-native-paper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  SearchContainer,
  Scripts,
  Title,
  ScriptList,
  LogoutButton,
  LoadContainer,
  Form,
  Fields,
  SearchButtonIcon,
  SearchButton,
  SearchInput,
  ListTitle,
} from './styles';
import { useAuth } from '../../hooks/auth';
import theme from '../../global/styles/theme';

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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      search: '',
    },
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

  async function handleClear() {
    setValue('search', '');
    setSpeeches(savedSpeeches);
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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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

            <SearchContainer>
              <Form>
                <Fields>
                  <View>
                    <Controller
                      name="search"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            margin: 4,
                            padding: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            backgroundColor: '#fff',
                          }}
                        >
                          <View
                            style={{
                              flex: 5,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <SearchInput
                              onChangeText={onChange}
                              value={value}
                              placeholder="Title, script, etc..."
                              returnKeyType="search"
                              style={{ backgroundColor: 'transparent' }}
                              onSubmitEditing={handleSubmit(handleSearch)}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            {String(value).length > 0 && value !== undefined ? (
                              <SearchButton onPress={handleSubmit(handleClear)}>
                                <SearchButtonIcon name="x" />
                              </SearchButton>
                            ) : (
                              <SearchButton
                                onPress={handleSubmit(handleSearch)}
                              >
                                <SearchButtonIcon name="search" />
                              </SearchButton>
                            )}
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </Fields>
              </Form>
            </SearchContainer>
          </TouchableWithoutFeedback>
          <Scripts>
            <ListTitle>List</ListTitle>
            <ScriptList
              data={speeches}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ScriptCard data={item} />}
              ListEmptyComponent={() => (
                <>
                  {savedSpeeches.length > 0 ? (
                    <Title>No results</Title>
                  ) : (
                    <Title>No Scripts yet. Please insert one.</Title>
                  )}
                </>
              )}
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
