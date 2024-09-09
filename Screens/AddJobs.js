import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {Button, TextInput, Dialog, Portal, Provider} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function AddJobs({navigation}) {
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [branch, setBranch] = useState('');
  const [experiance, setExperiance] = useState('');
  const [loader, setLoader] = useState(false);
  var [file, setFile] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('Select Job Title');

  const options = [
    'Full Stack Developer',
    'Mern Stack Developer',
    'Backend Developer',
    'Frontend Developer',
  ];

  const handleOptionSelect = option => {
    setSelectedJob(option);
    setIsDropdownOpen(false);
  };

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
        console.log('Image URI: ', response.assets[0].uri);
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

  const JobAnnouncement = async () => {
    if (selectedJob == 'Select Job Title') {
      errorShow('error', 'please Select Job title');
    } else if (salary == '') {
      errorShow('error', 'please enter offering salary');
    } else if (experiance == '') {
      errorShow('error', 'please enter your experiance');
    } else if (branch == '') {
      errorShow('error', 'please enter your branch');
    } else if (file == '') {
      errorShow('error', 'please enter image');
    } else {
      try {
        setLoader(true);

        const reference = database().ref(`Jobs/`).push();
        const uniquekey = reference.key;
        var imageLink = await imageDownload();
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        var jobObj = {
          title: selectedJob,
          experiance: experiance,
          salary: salary,
          branch: branch,
          date: formattedDate,
          jobImage: imageLink,
        };
        await reference.set(jobObj);
        errorShow('success', ' successfully added in Job');
      } catch (e) {
        errorShow('error', `error ${e}`);
        console.log(e);
      } finally {
        setTitle('');
        setSalary('');
        setBranch('');
        setExperiance('');
        setFile('');
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
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <TouchableOpacity style={styles.back}>
          <Text style={{alignSelf: 'flex-start'}}>
            <AntIcon
              onPress={() => {
                navigation.navigate('Admin Portal');
              }}
              name="arrowleft"
              size={20}
              color="white"
            />
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginTop: scale(25),
            fontSize: 22,
            fontWeight: '600',
            color: 'black',
            marginHorizontal: moderateScale(12),
          }}>
          Job Announcement
        </Text>

        <View
          style={{
            marginTop: verticalScale(25),
            marginHorizontal: moderateScale(10),
          }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.buttonText}>{selectedJob}</Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownOptions}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => handleOptionSelect(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            label="Experiance required :"
            placeholder=" Experiance required"
            activeOutlineColor="#710193"
            value={experiance}
            style={{
              borderRadius: 18,
              fontSize: 13,
              marginVertical: verticalScale(5),
            }}
            mode="outlined"
            onChangeText={experiance => setExperiance(experiance)}
          />
          <TextInput
            label="Branch :"
            placeholder="Branch"
            activeOutlineColor="#710193"
            value={branch}
            style={{
              borderRadius: 18,
              fontSize: 13,
              marginVertical: verticalScale(5),
            }}
            mode="outlined"
            onChangeText={branch => setBranch(branch)}
          />

          <TextInput
            label="Offering Salary :"
            placeholder="Offering Salary"
            activeOutlineColor="#710193"
            value={salary}
            style={{
              borderRadius: 18,
              fontSize: 13,
              marginVertical: verticalScale(5),
            }}
            mode="outlined"
            onChangeText={salary => setSalary(salary)}
          />
        </View>

        {file != '' ? (
          <TouchableOpacity
            onPress={() => DeSelectImage()}
            style={{
              borderWidth: 1,
              backgroundColor: 'white',
              borderRadius: 6,
              borderColor: 'grey',
              width: 'auto',
              height: 130,
              marginHorizontal: moderateScale(10),
              marginVertical: verticalScale(6),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              <MaterialIcons name="deselect" color="#710193" size={32} />
            </Text>
            <Text style={{color: 'black'}}>Deselect Image</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => ImagePicker()}
            style={{
              borderWidth: 1,
              backgroundColor: 'white',
              borderRadius: 6,
              borderColor: 'grey',
              width: 'auto',
              height: 130,
              marginHorizontal: moderateScale(10),
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: verticalScale(6),
            }}>
            <Text>
              <MaterialIcons
                name="add-photo-alternate"
                color="#710193"
                size={32}
              />
            </Text>
            <Text style={{color: 'black'}}>Select Photo</Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            marginHorizontal: 8,
            flexDirection: 'row',
            marginTop: verticalScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            style={{
              flex: 1,
              backgroundColor: '#710193',
              marginHorizontal: moderateScale(2),
              justifyContent: 'center',
              height: scale(42),
            }}
            mode="contained"
            onPress={() => JobAnnouncement()}>
            Announce Job
          </Button>
        </View>

        <View
          style={{
            marginHorizontal: 8,
            flexDirection: 'row',
            marginTop: verticalScale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            style={{
              flex: 1,
              backgroundColor: '#710193',
              marginHorizontal: moderateScale(2),
              justifyContent: 'center',
              marginBottom: scale(8),
              height: scale(42),
            }}
            mode="contained"
            onPress={() => {
              navigation.navigate('Delete Jobs');
            }}>
            Recent Jobs
          </Button>
        </View>
      </ScrollView>
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
  dropdownButton: {
    padding: 14,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    color: 'gray',
  },
  dropdownOptions: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    textAlign: 'center',
  },
});

export default AddJobs;
