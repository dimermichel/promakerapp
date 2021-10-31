import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Container, Header, Title, Form, Fields, Icon } from './styles';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { useAuth } from '../../hooks/auth';

interface FormData {
  title: string;
  text: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Inform a Title'),
  text: Yup.string().required('Inform a Script'),
});

export function Register() {
  const { user } = useAuth();

  const navigation = useNavigation();

  const dataKey = `@promakerapp:script_user:${user.id}`;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleRegister(form: FormData) {
    const newScript = {
      id: `${uuid.v4()}`,
      title: form.title,
      text: form.text,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [...currentData, newScript];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();

      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error, 'error');
      Alert.alert('Error', 'An error occurred while registering');
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      data && console.log(JSON.parse(data));
    }
    loadData();
    // async function removeAll () {
    //     await AsyncStorage.removeItem(dataKey);
    // }
    // removeAll();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header>
          <Icon
            name="arrow-left"
            size={24}
            color="#fff"
            onPress={handleGoBack}
          />
          <Title>Create Script</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="title"
              control={control}
              placeholder="Title"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="text"
              control={control}
              placeholder="Hi this is a new script..."
              multiline
              style={{ height: 400 }}
              error={errors.amount && errors.amount.message}
            />
          </Fields>
          <Button
            title="Save"
            onPress={handleSubmit(handleRegister)}
            style={{ marginTop: 16 }}
          />
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
}
