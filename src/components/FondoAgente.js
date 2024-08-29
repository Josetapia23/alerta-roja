import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const FondoAgente = () => {
  return (
    <View style={styles.headerBg}>
      <Svg height="620" width="700" style={styles.ellipse1}>
        <Circle cx="350" cy="350" r="350" fill="#0060FF" fillOpacity="0.5" />
      </Svg>
      <Svg height="492" width="492" style={styles.ellipse2}>
        <Circle cx="246" cy="246" r="246" fill="rgba(93, 161, 236, 0.48)" fillOpacity="0.5" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBg: {
    position: 'absolute',
    width: 430,
    height: 363,
    top: 0,
    backgroundColor: '#063971',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipse1: {
    position: 'absolute',
    top: -256,
    left: -350,
  },
  ellipse2: {
    position: 'absolute',
    top: -152,
    left: -246,
  },
});

export default FondoAgente;
