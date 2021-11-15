import React from 'react';

import Animated from 'react-native-reanimated';
import { Image } from 'react-native';
import logoImg from '../../assets/logo.png';

import { Container } from './styles';

export function Splash() {
  return (
    <Container>
      <Animated.View>
        <Image source={logoImg} width={141} height={151} />
      </Animated.View>
    </Container>
  );
}
