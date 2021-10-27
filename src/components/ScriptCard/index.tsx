import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  Container,
  Title,
  Text,
  Footer,
  IconContainer,
  Icon,
  Date,
  IconButton,
} from './styles';

export interface ScriptCardProps {
  title: string;
  text: string;
  date: string;
}

interface Props {
  data: ScriptCardProps;
}

export default function ScriptCard({ data }: Props) {
  const navigation = useNavigation();
  return (
    <Container>
      <Title>{data.title}</Title>
      <Text ellipsizeMode="tail" numberOfLines={3} style={{ width: 100 }}>
        {data.text}
      </Text>

      <Footer>
        <IconContainer>
          <Date>{data.date}</Date>
        </IconContainer>
        <IconButton onPress={() => navigation.navigate('CameraRecord', data)}>
          <Icon name="play" />
        </IconButton>
      </Footer>
    </Container>
  );
}
