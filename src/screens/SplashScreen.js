import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.rectangle} />
      <View style={styles.ellipse4} />
      <View style={styles.ellipse5} />
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    position: 'absolute',
    width: 430,
    height: 932,
    left: 0,
    top: 0,
    backgroundColor: '#F84343',
  },
  ellipse4: {
    position: 'absolute',
    width: 320,
    height: 320,
    left: 228,
    top: -130,
    backgroundColor: '#FA5353',
    borderRadius: 160,
  },
  ellipse5: {
    position: 'absolute',
    width: 320,
    height: 320,
    left: -92,
    top: 753,
    backgroundColor: '#FA5353',
    borderRadius: 160,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 210,
    height: 210,
  },
});

export default SplashScreen;
