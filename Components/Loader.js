import {Text, StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';

export default class Loader extends Component {
  render() {
    return (
      <View style={styles.overlay}>
        <Text>
          {' '}
          <ActivityIndicator animating={true} color="purple" />
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    // flex:1
  },
});
