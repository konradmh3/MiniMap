import { View, Image, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Svg, { G, Line, Circle } from 'react-native-svg';
import { Magnetometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/DeviceSensor';




export default function HomeScreen(){
  const [rot, setRot] = useState(0);

  // HANDLING MAGNETOMETER ********************************************************
  const [{ x, y, z }, setData] = useState<{
    x: number;
    y: number;
    z: number;
  }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  Magnetometer.setUpdateInterval(100);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        if (Math.atan2(result.y, result.x) >= 0) {
          setRot(-Math.round(Math.atan2(result.y, result.x) * (180 / Math.PI))+360);
        }
        else {
          setRot(-Math.round((Math.atan2(result.y, result.x) + 2 * Math.PI) * (180 / Math.PI))+360);
        }
        // console.log('Rotation: ', rot);
        // console.log(result);
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      console.log(rot);
    };
  }, [rot]);

  // HANDLING MAGNETOMETER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRot(rot => rot + .5);
  //     console.log('Function called every .1 seconds', rot);
  //   }, 100); // 5000 milliseconds = 5 seconds
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <View style={{height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Svg  height="100%" width="100%" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2.5" fill="grey" />
          <G transform={`rotate(${rot}, 50, 50)`}>
            <Line x1="20" y1="50" x2="80" y2="50" stroke="black" stroke-width="5"/>
            <Line x1="65" y1="35" x2="80" y2="50" stroke="black" stroke-width="5"/>
            <Line x1="65" y1="65" x2="80" y2="50" stroke="black" stroke-width="5"/>
          </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
