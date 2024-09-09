import React, {useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loader from './Loader';
import {AuthContext} from './AuthProvider';
import Toast from 'react-native-toast-message';

const CustomDrawer = props => {
  const [loading, setLoading] = useState(false);
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const {setUser} = useContext(AuthContext);

  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };

  const userLogout = async () => {
    const user = auth().currentUser;
    console.log(user);
    if (user) {
      try {
        setLoading(true);
        setUser(null);
        await auth().signOut();
        // Handle successful sign out (e.g., navigate to login screen)
        console.log('Signed out successfully!');
        errorShow('success', 'Signed out successfully!');
      } catch (error) {
        console.log(error);
        errorShow('error', ' No user currently signed in');
      } finally {
        // RNRestart.restart();
        setLoading(false);
      }
    } else {
      errorShow('error', 'No user is currently logged in');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      setLoading(true);
      try {
        if (currentUser) {
          const userUID = currentUser.uid;
          const userRef = database().ref(`/users/${userUID}`);
          const snapshot = await userRef.on('value', snapshot => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
            } else {
              console.log('No data available');
            }
          });

          return () => userRef.off('value', snapshot);
        }
      } catch (e) {
        console.log('errorrr');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#8200d6'}}>
        <ImageBackground
          source={require('../Assets/Images/menu-bg.jpeg')}
          style={{padding: 20}}>
          {userData ? (
            <Image
              source={{uri: `${userData.userImageLink}`}}
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
          ) : (
            <Image
              source={{
                uri: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Photos.png',
              }}
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
          )}

          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {userData ? userData.userName : 'UserName'}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto-Regular',
                marginRight: 5,
              }}>
              {userData ? userData.userEmail : 'UserEmail'}
            </Text>
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="share-social-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => userLogout()}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {loading && <Loader />}
    </View>
  );
};

export default CustomDrawer;
