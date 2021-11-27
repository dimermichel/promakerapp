import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justifyContent: flex-end;
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 18px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const Form = styled.ScrollView`
  flex: 1;
  width: 100%;
  padding: 24px;
`;

export const Fields = styled.View``;

export const Icon = styled(Feather)`
  position: relative;
  width: 100%;
  padding: 0 20px;
  bottom: -${RFValue(26)}px;
  left: 0;
  font-size: ${RFValue(24)}px;
  z-index: 9999;
`;
