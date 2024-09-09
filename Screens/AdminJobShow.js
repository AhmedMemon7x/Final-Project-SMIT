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
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AntIcon from 'react-native-vector-icons/AntDesign';

function AdminJobShow() {
  const [jobsData, setJobsData] = useState([]);
  const [loader, setLoader] = useState(false);

  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobsData();
    }, []),
  );

  const fetchJobsData = async () => {
    // Get the current user
    try {
      const currentUser = auth().currentUser;
      setLoader(true);
      if (currentUser) {
        const userUID = currentUser.uid;
        const userRef = database().ref(`/Jobs`);
        const snapshot = userRef.on('value', snapshot => {
          if (snapshot.exists()) {
            const JobsData = snapshot.val();
            const JobsList = Object.keys(JobsData).map(key => ({
              id: key,
              ...JobsData[key],
            }));
            setJobsData(JobsList);
            console.log(' data available');
          } else {
            console.log('No data available');
          }
        });

        // Cleanup listener on component unmount
        return () => userRef.off('value', snapshot);
      }
    } catch (e) {
      console.log('errorrr');
    } finally {
      setLoader(false);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginHorizontal: moderateScale(20),
        marginVertical: scale(20),
      }}>
      <Card>
        <Card.Cover source={{uri: `${item.jobImage}`}} />
      </Card>
      <Text
        style={{
          color: 'black',
          margin: scale(2),
          fontSize: 18,
          marginTop: scale(8),
        }}>
        Job: {item.title}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Branch: {item.branch}
      </Text>
      <View style={{position: 'absolute', right: 0, top: 12}}></View>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Experiance: {item.experiance}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Salary: {item.salary}
      </Text>
      <Text
        style={{
          color: 'gray',
          margin: scale(2),
          fontSize: 12,
          marginBottom: scale(8),
        }}>
        Posted on: {item.date}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{flex: 1}}
        data={jobsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      {loader && <Loader />}
    </View>
  );
}
export default AdminJobShow;

const styles = StyleSheet.create({});
