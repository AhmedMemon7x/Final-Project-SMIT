import React from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Button} from 'react-native-paper';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const PreSignup = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.person}>
        <Text>
          <EvilIcon name="user" size={80} color="#710193" />
        </Text>
      </View>

      <View style={{marginVertical: verticalScale(10)}}>
        <Text style={{color: 'black', fontSize: 25}}>Please Login</Text>
      </View>

      <View>
        <Text style={{color: 'black', fontSize: 16, fontWeight: '300'}}>
          You need to login first
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          marginTop: verticalScale(45),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          style={{
            flex: 1,
            backgroundColor: '#710193',
            height: scale(45),
            justifyContent: 'center',
          }}
          mode="contained"
          onPress={() => {
            navigation.navigate('PreLogin');
          }}>
          Login
        </Button>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          marginTop: verticalScale(15),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          style={{
            flex: 1,
            borderColor: '#710193',
            height: scale(45),
            justifyContent: 'center',
          }}
          textColor="#710193"
          mode="outlined"
          onPress={() => {
            navigation.navigate('PreUserSignup');
          }}>
          Sign Up
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'orange',
    padding: 3,
    borderRadius: 6,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  person: {
    borderColor: 'orange',
    marginTop: verticalScale(140),
  },
  btnView: {},
});

export default PreSignup;
