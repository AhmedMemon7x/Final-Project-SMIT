import {
  View,
  Alert,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Avatar, TextInput, Card} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import YoutubePlayer from 'react-native-youtube-iframe';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../Components/AuthProvider';

function UserEventShow({navigation}) {
  const [loader, setLoader] = useState(false);
  const [disabledUser, setDisable] = useState(false);
  const [post, setPost] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [userData, setUserData] = useState(null);
  const {user} = useContext(AuthContext);
  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, []),
  );

  const Disabled = () => {
    setDisable(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      setLoader(true);
      try {
        if (currentUser) {
          const userUID = currentUser.uid;
          const userRef = database().ref(`/users/${userUID}`);
          const snapshot = userRef.on('value', snapshot => {
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
        setLoader(false);
      }
    };
    fetchUserData();
  }, [user]);

  const addUsertoEvent = (eventKey, eventTitle) => {
    try {
      setLoader(true);
      const reference = database().ref(`eventJoined/`).push();
      const uniquekey = reference.key;
      var postObj = {
        eventTitle: eventTitle,
        eventKey: eventKey,
        uniqueKey: uniquekey,
        userEmail: userData.userEmail,
      };
      reference.set(postObj);
      errorShow('success', ' successfully added in Event');
    } catch (e) {
      errorShow('error', `error ${e}`);
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  const fetchPost = () => {
    const usersRef = database().ref('/Announcement');
    usersRef
      .once('value')
      .then(snapshot => {
        const post = snapshot.val();
        const usersList = Object.keys(post).map(key => ({
          id: key,
          ...post[key],
        }));
        setPost(usersList);
      })
      .catch(error => {
        errorShow('error', 'No recent Posts ');
      });
  };

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);
  const addNewLink = () => {
    var list = [
      ...videoList,
      {
        videoId: inp,
      },
    ];
    setVideoList(list);
    console.log(list);
  };

  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };
  const renderItem = ({item}) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginHorizontal: moderateScale(20),
        marginVertical: scale(20),
      }}>
      {item.videoId != '' ? (
        <YoutubePlayer
          height={150}
          play={playing}
          key={`${item.videoId}`}
          videoId={`${item.videoId}`}
          onChangeState={onStateChange}
        />
      ) : (
        <Card>
          <Card.Cover source={{uri: `${item.postImage}`}} />
        </Card>
      )}
      <View style={{position: 'absolute', right: 0, top: 12}}></View>
      <Text style={{color: 'black', margin: scale(2), fontSize: 18}}>
        Event: {item.title}
      </Text>
      <Text style={{color: 'black', margin: scale(2), fontSize: 14}}>
        Venue: {item.venue}
      </Text>
      <View style={{position: 'absolute', right: 0, top: 12}}></View>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Event Date: {item.description}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Posted on: {item.postDate}
      </Text>

      <View
        style={{
          flexDirection: 'row-reverse',
          marginVertical: verticalScale(10),
        }}>
        <TouchableOpacity
          style={{
            width: 70,
            backgroundColor: 'green',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
          }}
          onPress={() => addUsertoEvent(item.uniqueKey, item.title)}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            {disabledUser ? '  Registered' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity style={styles.back}>
        <Text style={{alignSelf: 'flex-start'}}>
          <AntIcon
            onPress={() => {
              navigation.navigate('User Portal');
            }}
            name="arrowleft"
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      <FlatList
        data={post}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      {loader && <Loader />}
    </View>
  );
}
const styles = StyleSheet.create({
  back: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#710193',
    padding: 3,
    borderRadius: 6,
    marginBottom: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export default UserEventShow;
