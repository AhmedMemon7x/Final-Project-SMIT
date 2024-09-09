import React, {useEffect, useState, useCallback} from 'react';
import {
  Alert,
  View,
  FlatList,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Searchbar, Card, IconButton, Text} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import SearchFilter from '../Components/SearchFilter';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';

function ViewAllJob({navigation}) {
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

        return () => userRef.off('value', snapshot);
      }
    } catch (e) {
      console.log('errorrr');
    } finally {
      setLoader(false);
    }
  };

  const deleteJob = async jobId => {
    try {
      setLoader(true);
      await database().ref(`/Jobs/${jobId}`).remove();
      setJobsData(prevUsers => prevUsers.filter(jobs => jobs.id !== jobId));
      errorShow('success', `Job has been deleted.`);
    } catch (error) {
      console.error('Error deleting user: ', error);
      errorShow('error', 'There was a problem deleting the job.');
    } finally {
      setLoader(false);
    }
  };
  console.log(jobsData, 'Ssss');

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
        Job Title: {item.title}
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
      <View style={{flexDirection: 'row-reverse', marginBottom: scale(8)}}>
        <TouchableOpacity
          style={{
            width: 80,
            backgroundColor: 'red',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
          }}
          onPress={() => deleteJob(item.id)}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            Delete
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
            name="arrowleft"
            onPress={() => {
              navigation.navigate('Jobs Announcement');
            }}
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
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

export default ViewAllJob;
