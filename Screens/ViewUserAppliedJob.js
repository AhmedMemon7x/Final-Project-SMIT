import React, {useEffect, useState, useCallback} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Searchbar, Card, Button, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import SearchFilter from '../Components/SearchFilter';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';

function ViewUserAppliedJob() {
  const [appliedJobsData, setAppliedJobsData] = useState([]);
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
        const userRef = database().ref(`/UserAppliedForJobs`);
        const snapshot = userRef.on('value', snapshot => {
          if (snapshot.exists()) {
            const JobsData = snapshot.val();
            const JobsList = Object.keys(JobsData).map(key => ({
              id: key,
              ...JobsData[key],
            }));
            setAppliedJobsData(JobsList);
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

  const updateStatus = (key, status) => {
    setLoader(true);

    const userRef = database().ref(`/UserAppliedForJobs/${key}`);

    userRef
      .update({
        status: status,
      })
      .then(() => {
        errorShow('success', 'Status updated successfully!');
        setLoader(false);
      })
      .catch(error => {
        errorShow('error', `Error: ${error.message}`);
        setLoader(false);
      });
  };

  const deleteUser = async jobApplierKey => {
    try {
      setLoader(true);
      await database().ref(`/UserAppliedForJobs/${jobApplierKey}`).remove();
      setAppliedJobsData(prevUsers =>
        prevUsers.filter(jobApplier => jobApplier.id !== jobApplierKey),
      );
      errorShow('success', `Applied user has been deleted.`);
    } catch (error) {
      console.error('Error deleting user: ', error);
      errorShow('error', 'There was a problem deleting the job.');
    } finally {
      setLoader(false);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={{
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
        marginHorizontal: moderateScale(20),
        marginVertical: verticalScale(20),
      }}>
      <Card>
        <Card.Cover source={{uri: `${item.jobImage}`}} />
      </Card>

      <View style={{position: 'absolute', right: 0, top: 12}}></View>
      <Text
        style={{
          color: 'black',
          margin: scale(2),
          marginTop: scale(4),
          fontSize: 16,
        }}>
        Name: {item.title}
      </Text>
      <Text style={{color: 'black', margin: scale(2), fontSize: 16}}>
        Email: {item.email}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Job Title: {item.jobTitle}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Job Branch: {item.jobBranch}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Job Salary: {item.jobSalary}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Experiance Required: {item.jobExperiance}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Status: {item.status}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        User Applied on: {item.userApplieddate}
      </Text>
      <Text style={{color: 'gray', margin: scale(2), fontSize: 12}}>
        Job Posted on: {item.jobDate}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          marginVertical: verticalScale(10),
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            width: 80,
            backgroundColor: 'yellow',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
          }}
          onPress={() => deleteUser(item.appliedUserKey)}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            Delete User
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 80,
            backgroundColor: 'red',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
          }}
          onPress={() => updateStatus(item.appliedUserKey, 'Rejected')}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            Reject
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 80,
            backgroundColor: 'green',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
          }}
          onPress={() => updateStatus(item.appliedUserKey, 'Accepted')}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{flex: 1}}
        data={appliedJobsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      {loader && <Loader />}
    </View>
  );
}

export default ViewUserAppliedJob;
