import {
  View,
  Alert,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Button,
  Avatar,
  TextInput,
  Card,
  Text,
  IconButton,
} from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AntIcon from 'react-native-vector-icons/AntDesign';

function AdminEventShow() {
  const [loader, setLoader] = useState(false);
  const [post, setPost] = useState([]);
  const [playing, setPlaying] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, []),
  );

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
        console.log(usersList.postImage);
        console.log(usersList.videoId);
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
      <Text style={{color: 'black', margin: scale(2), fontSize: 18}}>
        Event: {item.title}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Venue: {item.venue}
      </Text>
      <View style={{position: 'absolute', right: 0, top: 12}}></View>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Event Date: {item.description}
      </Text>
      <Text
        style={{
          color: 'gray',
          margin: scale(2),
          fontSize: 12,
          marginBottom: scale(8),
        }}>
        Posted on: {item.postDate}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={post}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

export default AdminEventShow;
