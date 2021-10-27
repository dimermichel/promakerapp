import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  position: absolute;
  z-index: 9999;
`;

export const Button = styled(RectButton)`
  background-color: red;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 40px;
`;

export const TeleprompterText = styled.Text`
  width: ${RFPercentage(45)}px;
  height: auto;
  font-size: 40px;
  font-weight: bold;
  color: rgba(0, 0, 100, 1);
`;
