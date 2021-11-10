import React, {
 useCallback, useRef, useMemo, useState 
} from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container,
  Title,
  Text,
  Footer,
  IconContainer,
  Icon,
  Date,
  IconButton,
  BottomSheetContainer,
  BottomSheetContent,
  BottomSheetActionsContainer,
  ActionsTextButton,
  ActionsText,
  SurroundingButton,
  ContainerButton,
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface ScriptCardProps {
  id: string;
  title: string;
  text: string;
  date: string;
}

interface Props {
  data: ScriptCardProps;
}

export default function ScriptCard({ data }: Props) {
  const [isScriptDeleted, setIsScriptDeleted] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();

  const dataKey = `@promakerapp:script_user:${user.id}`;
  const backdropPressBehavior = 'close';
  // hooks
  const bottomSheetActionsModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['12%', '25%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetActionsModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
    ),
    [backdropPressBehavior],
  );
  const handleDelete = useCallback(async () => {
    const { id } = data;

    if (id) {
      try {
        // TODO Delete Script
        const response = await AsyncStorage.getItem(dataKey);
        const speechesSaved = response ? JSON.parse(response) : [];
        const newSpeechesSaved = speechesSaved.filter(
          (speech) => speech.id !== id,
        );
        await AsyncStorage.setItem(dataKey, JSON.stringify(newSpeechesSaved));
        setIsScriptDeleted(true);
        bottomSheetActionsModalRef.current?.close();
      } catch (err) {
        Alert.alert('error', err.message);
      }
    }
  }, [data.id]);
  const handleEdit = () => {
    bottomSheetActionsModalRef.current?.close();
    navigation.push('Speech', data.id);
  };

  const handleDeleteModal = useCallback(() => {
    Alert.alert('Delete Script', 'Would you like to delete the script?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Delete', onPress: () => handleDelete() },
    ]);
  }, [handleDelete]);
  return (
    <>
      <>
        {!isScriptDeleted ? (
          <ContainerButton onPress={handlePresentModalPress}>
            <Title>{data.title}</Title>
            <Text ellipsizeMode="tail" numberOfLines={3} style={{ width: 100 }}>
              {data.text}
            </Text>

            <Footer>
              <IconButton
                onPress={() => navigation.navigate('CameraRecord', data)}
              >
                <Icon name="play" />
              </IconButton>
              {/* <IconButton onPress={handlePresentModalPress}>
                <Icon name="more-vertical" />
              </IconButton> */}
              <IconContainer>
                <Date>{data.date}</Date>
              </IconContainer>
            </Footer>
          </ContainerButton>
        ) : (
          <Container>
            <Title>This script has been deleted...</Title>
          </Container>
        )}
      </>
      <BottomSheetModal
        ref={bottomSheetActionsModalRef}
        backdropComponent={renderBackdrop}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetContainer>
          <BottomSheetContent>
            <Text
              style={{
                marginBottom: 16,
                fontFamily: theme.fonts.medium,
                fontSize: 18,
                color: '#464E5F',
              }}
            >
              Actions
            </Text>
            <BottomSheetActionsContainer>
              <ActionsTextButton onPress={handleEdit}>
                <Icon
                  name="edit"
                  size={14}
                  color="#464e5f"
                  style={{ marginRight: 8 }}
                />
                <ActionsText>Edit</ActionsText>
              </ActionsTextButton>
              <ActionsTextButton onPress={handleDeleteModal}>
                <Icon
                  name="x-square"
                  size={14}
                  color="#464e5f"
                  style={{ marginRight: 8 }}
                />
                <ActionsText>Delete</ActionsText>
              </ActionsTextButton>
            </BottomSheetActionsContainer>
          </BottomSheetContent>
        </BottomSheetContainer>
      </BottomSheetModal>
    </>
  );
}
