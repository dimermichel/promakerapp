import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../pages/Dashboard';
import { Register } from '../pages/Register';
import { CameraRecord } from '../pages/CameraRecord';

const { Navigator, Screen } = createStackNavigator();
export function AppRoutes() {
  return (
    <Navigator initialRouteName="Dashboard">
      <Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Speech"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="CameraRecord"
        component={CameraRecord}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
