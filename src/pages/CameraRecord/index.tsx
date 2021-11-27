import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from 'styled-components';
import Slider from '@react-native-community/slider';
import * as Sharing from 'expo-sharing';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Camera } from 'expo-camera';
import {
  ScrollView,
} from 'react-native-gesture-handler';
import {
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import { Container, TeleprompterText, ButtonsContainer, SliderContainer, ActionsContainer } from './styles';

type ContextType = {
  startY: number;
};

export const clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet'
  return Math.min(Math.max(lowerBound, value), upperBound);
}

export function CameraRecord({ route }) {
  const scrollOffset = useSharedValue(0);
  const scrollSpeed = useSharedValue(2)
  const theme = useTheme();
  const [scriptText, setScriptText] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);
  const [cameraRatio, setCameraRatio] = useState('16:9');
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [recording, setRecording] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [totalHeight, setTotalHeight] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      const { status: statusCamera } = await Camera.requestPermissionsAsync();
      if (statusCamera) setHasCameraPermission(statusCamera === 'granted');
      const { status: statusMicrophone } = await Camera.requestMicrophonePermissionsAsync();
      if (statusMicrophone) {
        setHasMicrophonePermission(statusMicrophone === 'granted');
      }
      if (Platform.OS === 'android' && cameraRef !== null) {
        const ratio = await cameraRef.getSupportedRatiosAsync();
        const ratioIndex = ratio.indexOf('16:9');
        if (ratioIndex !== -1) {
          setCameraRatio(ratio[ratioIndex]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (route.params) {
      const { text } = route.params;
      setScriptText(text);
    }
  }, [route]);

  const scroll = () => {
    scrollViewRef.current?.scrollTo({
      x: 0,
      y: scrollOffset.value + scrollSpeed.value,
      animated: true,
    });
  };

  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        scroll();
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
    if (totalHeight && scrollOffset.value >= totalHeight) {
      setIsButtonPressed(false);
      setIsScrolling(false);
    };
    console.log('scrollOffset', scrollOffset.value);
  };

  if (hasCameraPermission === null && hasMicrophonePermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasMicrophonePermission === false) {
    return <Text>No access to recording</Text>;
  }

  const handleButtonPress = () => {
    setIsButtonPressed(!isButtonPressed);
    setIsScrolling(!isScrolling);
  };

  const onLayout = event => {
    const { height } = event.nativeEvent.layout;
    const floorHeight = height ? Math.floor(height) - 304 : 0;
    setTotalHeight(floorHeight);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <Container
        style={{
          elevation: Platform.OS === 'android' ? 9999 : 0,
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'column',
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          onScrollBeginDrag={() => setIsScrolling(false)}
          onScrollEndDrag={() => isButtonPressed && setIsScrolling(true)}
          style={{
            marginHorizontal: 20,
            marginTop: getStatusBarHeight(),
            height: 300,
            elevation: Platform.OS === 'android' ? 9999 : 0,
            flexDirection: 'column',
          }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <TeleprompterText
            onLayout={onLayout}
            style={{
              elevation: Platform.OS === 'android' ? 9999 : 0,
            }}
          >
            {scriptText}
          </TeleprompterText>
        </ScrollView>
      </Container>
      <Camera
        style={{ flex: 1, position: 'relative', aspectRatio: 0.5625 }}
        type={type}
        ratio={cameraRatio}
        ref={(ref: Camera | null) => {
          setCameraRef(ref);
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: '80%',
          left: '10%',
          bottom: Platform.OS === 'ios' ? getBottomSpace() : 40,
          height: Platform.OS === 'ios' ? getBottomSpace() + 80 : 120,
          justifyContent: 'center',
          backgroundColor: 'rgba(31, 31, 31, 0.879)',
          borderRadius: 10,
          elevation: 9999,
          paddingBottom: getBottomSpace(),
          zIndex: 99999,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <ActionsContainer>
            <SliderContainer>
            <MaterialCommunityIcons name="speedometer-slow" size={24} color="white" />
              <Slider
                style={{ width: '80%', height: 40, }}
                minimumValue={1}
                maximumValue={3}
                value={scrollSpeed.value}
                thumbTintColor={theme.colors.secondary_light}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={(event) => {
                  cancelAnimation(scrollSpeed);
                  scrollSpeed.value = event;
                }}
              />
              <MaterialCommunityIcons name="speedometer" size={24} color="white" />
            </SliderContainer>
            <ButtonsContainer>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  );
                }}
              >
                <Ionicons
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-camera-reverse'
                      : 'md-camera-reverse'
                  }
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                }}
                onPress={handleButtonPress}
              >
                {isScrolling ?
                  <Ionicons name="pause" size={40} color="white" />
                  :
                  <Ionicons name="play" size={40} color="white" />
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={async () => {
                  if (!recording && !!cameraRef) {
                    setRecording(true);
                    const video = await cameraRef.recordAsync();
                    await Sharing.shareAsync(video.uri);
                    console.log('video', video);
                  } else {
                    setRecording(false);
                    if (cameraRef) cameraRef.stopRecording();
                  }
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: theme.colors.secondary_light,
                    height: 40,
                    width: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderRadius: 25,
                      borderColor: recording ? 'red' : 'white',
                      height: 30,
                      width: 30,
                      backgroundColor: recording ? 'red' : 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>
            </ButtonsContainer>
          </ActionsContainer>
        </View>
      </View>
    </View>
  );
}
