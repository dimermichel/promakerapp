import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  position: absolute;
  z-index: 9999;
`;

export const ActionsContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const ButtonsContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

export const SliderContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
  padding: 0 5px;
  padding-top: ${getStatusBarHeight()}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(50)}px;
  line-height: ${RFValue(65)}px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
`;
