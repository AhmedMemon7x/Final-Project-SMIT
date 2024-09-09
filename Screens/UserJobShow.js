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
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Avatar, TextInput, Card} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import AntIcon from 'react-native-vector-icons/AntDesign';
const UserJobShow = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [job, setJob] = useState([]);
  const [userData, setUserData] = useState(null);
  const [ind, setIndex] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, []),
  );

  const foodBtn = [
    {
      name: 'All',
    },
    {
      name: 'Full Stack Developer',
    },
    {
      name: 'Mern Stack Developer',
    },
    {
      name: 'Backend Developer',
    },
    {
      name: 'Frontend Developer',
    },
  ];

  const fetchPost = () => {
    const usersRef = database().ref('/Jobs');
    usersRef
      .once('value')
      .then(snapshot => {
        const post = snapshot.val();
        const usersList = Object.keys(post).map(key => ({
          id: key,
          ...post[key],
        }));
        setJob(usersList);
        console.log(usersList);
      })
      .catch(error => {
        errorShow('error', 'No recent jobs ');
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      setLoader(true);
      try {
        if (currentUser) {
          const userUID = currentUser.uid;
          const userRef = database().ref(`/users/${userUID}`);
          const snapshot = await userRef.on('value', snapshot => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
              console.log(snapshot.val(), 'job data');
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
  }, []);

  const ApplyForJob = async (
    jobTitle,
    jobDate,
    jobSalary,
    jobExperiance,
    jobBranch,
    jobImage,
  ) => {
    if (userData.userName == '') {
      errorShow('error', 'please enter Job title');
    } else if (userData.userEmail == '') {
      errorShow('error', 'please enter offering salary');
    } else if (userData.userImageLink == '') {
      errorShow('error', 'please enter your experiance');
    } else {
      try {
        setLoader(true);
        const currentUser = auth().currentUser;
        const reference = database().ref(`UserAppliedForJobs/`).push();
        const uniquekey = reference.key;
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const userUID = currentUser.uid;
        const formattedDate = `${day}/${month}/${year}`;

        var jobObj = {
          title: userData.userName,
          email: userData.userEmail,
          userImage: userData.userImageLink,
          userApplieddate: formattedDate,
          jobTitle: jobTitle,
          jobDate: jobDate,
          jobSalary: jobSalary,
          jobExperiance: jobExperiance,
          jobBranch: jobBranch,
          jobImage: jobImage,
          status: 'pending',
          userUID: userUID,
          appliedUserKey: uniquekey,
        };
        await reference.set(jobObj);
        errorShow('success', ' successfully Applied For Job');
      } catch (e) {
        errorShow('error', `error ${e}`);
        console.log(e);
      } finally {
        setLoader(false);
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

      <View style={{flexDirection: 'row-reverse', marginBottom: scale(10)}}>
        <TouchableOpacity
          style={{
            width: 100,
            backgroundColor: 'green',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 38,
          }}
          onPress={() =>
            ApplyForJob(
              item.title,
              item.date,
              item.salary,
              item.experiance,
              item.branch,
              item.jobImage,
            )
          }>
          <Text style={{color: 'white', fontSize: 12, fontWeight: '600'}}>
            Apply For Job
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
      <View style={{flexDirection: 'row', marginVertical: 10}}>
        <FlatList
          data={foodBtn}
          keyExtractor={i => {
            return i.name;
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({item, index: fIndex}) => {
            return (
              <Text
                onPress={() => {
                  setIndex(fIndex);
                }}
                style={{
                  marginHorizontal: moderateScale(20),
                  paddingHorizontal: moderateScale(27),
                  backgroundColor: fIndex === ind ? '#710193' : 'white',
                  paddingVertical: verticalScale(9),
                  borderRadius: 20,
                  color: fIndex === ind ? 'white' : 'black',
                  elevation: 2,
                  shadowColor: 'black',
                  shadowRadius: 3,
                }}>
                {item.name}
              </Text>
            );
          }}
        />
      </View>

      <FlatList
        data={job}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      {loader && <Loader />}
    </View>
  );
};
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
export default UserJobShow;
