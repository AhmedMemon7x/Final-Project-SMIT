import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {Button, Avatar, TextInput} from 'react-native-paper';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const SignUp = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  var [file, setFile] = useState('');
  const [checked, setChecked] = useState(false);

  const DeSelectImage = () => {
    setFile('');
  };

  const ImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled the gallery.');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        setFile(response.assets[0].uri);
      }
    });
  };
  const imageDownload = async () => {
    try {
      console.log('Image uploaded');
      const reference = storage().ref('users/' + Date.now());
      await reference.putFile(file);
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const signUpUser = async () => {
    if (userName == '') {
      errorShow('error', 'please enter your name');
    } else if (email == '') {
      errorShow('error', 'please enter your email');
    } else if (password == '') {
      errorShow('error', 'please enter your password');
    } else if (file == '') {
      errorShow('error', 'please enter your Profile pic');
    } else if (checked == false) {
      errorShow('error', 'please agree to the terms and conditions');
    } else {
      const user = auth().currentUser;
      if (user) {
        errorShow('error', 'please Sign Out first');
      } else {
        setLoader(true);
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async userCreditals => {
              var imageLink = await imageDownload();

              var userObj = {
                userName: userName,
                userEmail: email,
                userPassword: password,
                userUid: userCreditals.user.uid,
                userImageLink: imageLink,
              };
              const reference = database().ref(
                `users/${userCreditals.user.uid}`,
              );
              await reference.set(userObj);
              errorShow('success', 'Sign successful');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                errorShow('error', 'That email address is already in use!');
              }

              if (error.code === 'auth/invalid-email') {
                errorShow('error', 'That email address is invalid!');
              }

              console.error(error);
            });
        } catch (e) {
          console.log(e);
        } finally {
          setLoader(false);
        }
      }
    }
  };
  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back}>
        <Text style={{alignSelf: 'flex-start'}}>
          <AntIcon
            name="arrowleft"
            onPress={() => {
              navigation.navigate('PreSignup');
            }}
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginVertical: verticalScale(24),
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
        }}>
        <Text style={{color: 'black', fontSize: 25, flex: 1}}>
          Create Account
        </Text>
        {file != '' ? (
          <TouchableOpacity>
            <Avatar.Image
              size={45}
              style={{marginRight: 10, position: 'relative', bottom: 4}}
              source={{uri: file}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => ImagePicker()}>
            <Avatar.Image
              size={45}
              style={{
                marginRight: 10,
                position: 'relative',
                bottom: 4,
                backgroundColor: 'white',
              }}
              source={{
                uri: 'https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-6/128/profile-male-circle2-512.png',
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginHorizontal: scale(16), flexDirection: 'row'}}>
        <TextInput
          label="Full Name"
          style={{flex: 1, borderRadius: 18, fontSize: 12}}
          mode="outlined"
          activeOutlineColor="#710193"
          value={userName}
          onChangeText={userName => setUserName(userName)}
        />
      </View>

      <View
        style={{
          marginHorizontal: scale(16),
          marginVertical: verticalScale(8),
          flexDirection: 'row',
        }}>
        <TextInput
          label="Email"
          mode="outlined"
          activeOutlineColor="#710193"
          style={{flex: 1, borderRadius: 18, fontSize: 12}}
          value={email}
          onChangeText={email => setEmail(email)}
        />
      </View>

      <View style={{marginHorizontal: scale(16), flexDirection: 'row'}}>
        <TextInput
          label="Password"
          activeOutlineColor="#710193"
          value={password}
          style={{flex: 1, borderRadius: 18, fontSize: 12}}
          mode="outlined"
          onChangeText={password => setPassword(password)}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
          marginTop: verticalScale(25),
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            justifyContent: 'flex-start',
            color: 'black',
          }}>
          OTP will be sent to your email
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
          marginTop: verticalScale(12),
        }}>
        {checked ? (
          <TouchableOpacity
            onPress={() => {
              setChecked(false);
            }}>
            <Ionicon
              style={{position: 'relative', bottom: 3}}
              name="checkbox"
              size={24}
              color="#710193"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setChecked(true);
            }}>
            <Ionicon
              style={{position: 'relative', bottom: 3}}
              name="square-outline"
              size={24}
              color="#710193"
            />
          </TouchableOpacity>
        )}

        <Text style={{flex: 1, paddingLeft: scale(6), fontSize: 13}}>
          Agreed to all terms and conditions
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          marginTop: verticalScale(40),
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
          onPress={() => signUpUser()}>
          REGISTER
        </Button>
      </View>
      {loader && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  back: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#710193',
    padding: 3,
    borderRadius: 6,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
export default SignUp;
