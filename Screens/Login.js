import React from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useState, useContext} from 'react';
import {AuthContext} from '../Components/AuthProvider';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Loader from '../Components/Loader';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const Login = ({navigation}) => {
  const {setUser} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };

  const userLogin = async () => {
    const user = auth().currentUser;
    if (user) {
      errorShow('error', 'you already logged in');
    } else {
      console.log(email, password);
      if (!email.trim() || !password.trim()) {
        errorShow('error', 'Please enter Data correctly');
      } else {
        try {
          setLoader(true);
          await auth()
            .signInWithEmailAndPassword(email, password)
            .then(async userCredential => {
              const currentUser = auth().currentUser;
              const userUID = currentUser.uid;
              const userRef = database().ref(`/users/${userUID}`);
              const snapshot = await userRef.once('value', async snapshot => {
                if (snapshot.exists()) {
                  setUserData(snapshot.val());
                  console.log(userData, 'try to delete user');
                } else {
                  console.log('No data available+ try to dlete it');
                  await auth().signOut();
                  errorShow(
                    'error',
                    'Admin has deleted your account please create new one',
                  );
                  return;
                }
              });

              const user = userCredential.email;
              console.log(userCredential);
              console.log('sign in');
              errorShow('success', 'Login succcessful');
            })
            .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              errorShow('error', error.message);
            });
        } catch (error) {
          errorShow('error', error.message);
        } finally {
          setLoader(false);
        }
      }
    }
  };

  const userLogout = async () => {
    const user = auth().currentUser;
    console.log(user);
    if (user) {
      try {
        setLoader(true);
        setUser(null);
        await auth().signOut();
        console.log('Signed out successfully!');
        errorShow('success', 'Signed out successfully!');
      } catch (error) {
        console.log(error);
        errorShow('error', ' No user currently signed in');
      } finally {
        setLoader(false);
      }
    } else {
      errorShow('error', 'No user is currently logged in');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back}>
        <Text style={{alignSelf: 'flex-start'}}>
          <AntIcon
            onPress={() => {
              navigation.navigate('PreSignup');
            }}
            name="arrowleft"
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      <View
        style={{
          marginTop: verticalScale(55),
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
        }}>
        <Text
          style={{color: 'black', fontSize: 25, flex: 1, fontWeight: '600'}}>
          Login
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: scale(16),
          marginTop: verticalScale(24),
          flexDirection: 'row',
        }}>
        <TextInput
          label="Email"
          activeOutlineColor="#710193"
          value={email}
          style={{flex: 1, borderRadius: 18, fontSize: 13}}
          mode="outlined"
          onChangeText={email => setEmail(email)}
        />
      </View>

      <View
        style={{
          marginHorizontal: scale(16),
          marginTop: verticalScale(15),
          flexDirection: 'row',
        }}>
        <TextInput
          label="Password"
          activeOutlineColor="#710193"
          value={password}
          style={{flex: 1, borderRadius: 18, fontSize: 13}}
          mode="outlined"
          onChangeText={password => setPassword(password)}
        />
      </View>

      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          marginTop: verticalScale(25),
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
          onPress={() => userLogin()}>
          LOGIN
        </Button>
      </View>

      <View style={{marginTop: verticalScale(24), marginLeft: scale(180)}}>
        <Text
          onPress={() => {
            navigation.navigate('PreUserSignup');
          }}
          style={{
            paddingBottom: scale(8),
            borderBottomWidth: 1,
            borderBottomColor: '#710193',
            fontWeight: '400',
            fontSize: 15,
            color: '#710193',
            textAlign: 'right',
          }}>
          Create an account?
        </Text>
      </View>
      {loader && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
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

export default Login;
