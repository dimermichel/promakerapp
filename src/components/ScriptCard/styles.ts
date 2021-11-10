import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.secondary_light};
  border-radius: 5px;

  padding: 17px 24px;
  margin-bottom: 16px;
`;

export const ContainerButton = styled(RectButton)`
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  padding: 17px 24px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;

export const Text = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(8)}px;
`;
export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 19px;
`;

export const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.secondary_light};
`;

export const IconButton = styled(RectButton)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const SurroundingButton = styled(RectButton)`
  flex: 1;
`;

export const Date = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const BottomSheetContainer = styled.View`
  flex: 1;
  padding: 24px;
  background-color: #fff;
`;

export const BottomSheetContent = styled.View`
  flex: 1;
  align-items: center;
`;

export const BottomSheetActionsContainer = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: space-around;
  width: 90%;
`;

export const ActionsTextButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  width: 100%;
  padding: 0 10px;
  justify-content: flex-start;
  align-items: center;
`;

export const ActionsText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;

  color: #464e5f;
`;

export const DeletedPostTextContainer = styled.View`
  flex-direction: column;
  padding-bottom: 16px;
  padding-top: 4px;
`;

export const DeletedPostText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: #b5b5c3;
`;
