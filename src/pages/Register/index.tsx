import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
 Container, Header, Title, Form, Fields, Icon 
} from './styles';
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

export function Register({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const scriptId = route.params;
  const dataKey = `@promakerapp:script_user:${user.id}`;

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleRegister(form: FormData) {
    const newScript = {
      id: scriptId || `${uuid.v4()}`,
      title: form.title,
      text: form.text,
      date: new Date(),
    };

    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      if (scriptId) {
        const filteredData = currentData.filter(
          script => script.id !== scriptId,
        );
        const dataFormatted = [...filteredData, newScript];
        await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      } else {
        const dataFormatted = [...currentData, newScript];
        await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      }
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
      try {
        setLoading(true);
        const data = await AsyncStorage.getItem(dataKey);
        const currentData = data ? JSON.parse(data) : [];
        const filteredData = currentData.filter(
          script => script.id === scriptId,
        );
        if (filteredData.length > 0) {
          setValue('title', filteredData[0].title);
          setValue('text', filteredData[0].text);
        }
        data && console.log(JSON.parse(data));
      } catch (error) {
        console.log(error, 'error');
      } finally {
        setLoading(false);
      }
    }
    if (scriptId) {
      loadData();
    }
  }, [dataKey, scriptId]);

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
          <Title>{scriptId ? 'Edit Script' : 'Create Script'}</Title>
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
            enabled={!loading}
            title="Save"
            onPress={handleSubmit(handleRegister)}
            style={{ marginTop: 16 }}
          />
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
}
