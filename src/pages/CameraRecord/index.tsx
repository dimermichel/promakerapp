import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  NativeModules,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';

import * as Sharing from 'expo-sharing';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  useSharedValue,
  cancelAnimation,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { number } from 'yup';
import { Container, TeleprompterText } from './styles';

type ContextType = {
  startY: number;
};

export function CameraRecord({ route }) {
  const [scriptText, setScriptText] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);
  const [cameraRatio, setCameraRatio] = useState('16:9');
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [recording, setRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentY, setCurrentY] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(40);
  const [totalHeight, setTotalHeight] = useState(20);
  const [type, setType] = useState(Camera.Constants.Type.front);

  const scrollViewRef = useRef(null);
  const { ScrollViewManager } = NativeModules;

  const aref = useAnimatedRef();
  const newScroll = useSharedValue(50);
  const newDuration = useSharedValue(0);
  const pressed = useSharedValue(false);
  useDerivedValue(() => {
    scrollTo(aref, 0, newScroll.value * 20, true);
  });

  const eventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, ctx) => {
      pressed.value = true;
      cancelAnimation(newScroll);
      ctx.startY = newScroll.value;
    },
    onActive: (event, ctx) => {
      newScroll.value = ctx.startY + event.translationY;
      console.log(newScroll.value);
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
      cancelAnimation(newScroll);
      // newScroll.value = event.translationY;
    },
  });

  useEffect(() => {
    (async () => {
      const { status: statusCamera } = await Camera.requestPermissionsAsync();
      if (statusCamera) setHasCameraPermission(statusCamera === 'granted');
      const { status: statusMicrophone } =        await Camera.requestMicrophonePermissionsAsync();
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

  let scrollOffset = 0;

  const scroll = () => {
    // aref.current?.scrollTo({
    //   x: 0,
    //   y: scrollOffset + scrollSpeed,
    //   animated: true,
    // });
    // newScroll.value += scrollOffset + scrollSpeed;
  };

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(newScroll.value, {
          duration: newDuration.value,
        }),
      },
    ],
  }));

  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        // scroll();
        newScroll.value = scrollOffset + scrollSpeed;
      }, 1000 / 60);
      return () => clearInterval(interval);
    }
  }, [isScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset = event.nativeEvent.contentOffset.y;
  };

  if (hasCameraPermission === null && hasMicrophonePermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasMicrophonePermission === false) {
    return <Text>No access to recording</Text>;
  }

  function move() {
    let width = currentY;
    const id = setInterval(frame, 16);
    function frame() {
      if (width >= totalHeight - 300 || isDragging) {
        // if (isDragging) {
        clearInterval(id);
      } else {
        console.log('isDragging', isDragging);
        console.log('totalHeight', totalHeight);
        console.log('width', width);
        width++;
        if (scrollViewRef !== null) {
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: width + scrollSpeed,
            animated: true,
          });
        }
      }
    }
  }

  const handleButtonPress = () => {
    if (Platform.OS === 'android' && scrollViewRef.current !== null) {
      // let t;
      // let width = currentY;
      // function timedCount() {
      //   scrollViewRef.current.scrollTo({
      //     x: 0,
      //     y: width++,
      //     animated: true,
      //   });
      //   if (width > totalHeight) {
      //     clearTimeout(t);
      //   }
      //   t = setTimeout(timedCount, 10);
      // }
      // timedCount();
    } else {
      // move();
      // setIsScrolling(!isScrolling);
    }
    newDuration.value = (scriptText.length / 15) * 1000;
    newScroll.value = 0;
    if (newScroll.value !== -totalHeight) newScroll.value = -totalHeight;
    console.log('newScroll.value', newScroll.value);
    console.log('newDuration', newDuration.value);
  };

  const onLayout = event => {
    const { height } = event.nativeEvent.layout;
    setTotalHeight(height);
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
        {/* <ScrollView
          ref={aref}
          onLayout={event => {
            event.nativeEvent.layout.height;
            console.log('layoutHeight', event.nativeEvent.layout.height);
            console.log(scrollViewRef.current.contentOffset);
            if (ScrollViewManager && ScrollViewManager.getContentSize) {
              ScrollViewManager.getContentSize(
                ReactNative.findNodeHandle(scrollViewRef.current),
                contentSize => {
                  console.log('contentSize', contentSize.height);
                  setTotalHeight(contentSize.height);
                },
              );
            }
          }}
          onScroll={handleScroll}
          onScrollBeginDrag={() => {
            setIsDragging(true);
            console.log('isDragging onScrollBeginDrag', isDragging);
          }}
          onScrollEndDrag={() => {
            setIsDragging(false);
            console.log('isDragging onScrollEndDrag', isDragging);
          }}
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
            style={{
              elevation: Platform.OS === 'android' ? 9999 : 0,
            }}
          >
            {scriptText}
          </TeleprompterText>
        </ScrollView> */}
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[style]} onLayout={onLayout}>
            <TeleprompterText
              style={{
                elevation: Platform.OS === 'android' ? 999 : 0,
              }}
            >
              {scriptText}
            </TeleprompterText>
          </Animated.View>
        </PanGestureHandler>
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
          bottom: getBottomSpace(),
          height: Platform.OS === 'ios' ? getBottomSpace() + 80 : 80,
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
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
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
              style={{ alignSelf: 'center' }}
              onPress={() => {
                newDuration.value -= 200;
                if (newDuration.value < 0) newDuration.value = 0;
                console.log('newDuration', newDuration.value);
              }}
            >
              <Ionicons name="alert" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                backgroundColor: isScrolling ? '#00ff00' : '#ff0000',
              }}
              onPress={handleButtonPress}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: 'white',
                  height: 50,
                  width: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: 'white',
                    height: 40,
                    width: 40,
                    backgroundColor: 'white',
                  }}
                />
              </View>
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
                  borderColor: 'red',
                  height: 50,
                  width: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: 'red',
                    height: 40,
                    width: 40,
                    backgroundColor: recording ? 'blue' : 'red',
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
