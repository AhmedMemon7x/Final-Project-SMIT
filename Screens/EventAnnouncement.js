import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, TextInput, Dialog, Portal, Provider} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function EventAnnouncement({navigation}) {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [videoId, setVideoId] = useState('');
  var [file, setFile] = useState('');
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  const DeSelectImage = () => {
    setFile('');
  };
  const DeSelectVideo = () => {
    setVideoId('');
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

  const createAnnouncement = async () => {
    if (title == '') {
      errorShow('error', 'please enter the title');
    } else if (venue == '') {
      errorShow('error', 'please enter the venue');
    } else if (file == '' && videoId == '') {
      errorShow('error', 'please enter or select either Image or Profile pic');
    } else if (file !== '' && videoId !== '') {
      errorShow(
        'error',
        'please enter or select either Image or videoId not both',
      );
    } else {
      try {
        setLoader(true);

        const reference = database().ref(`Announcement/`).push();
        const uniquekey = reference.key;
        var imageLink = await imageDownload();

        var postObj = {
          title: title,
          description: description,
          videoId: videoId,
          uniqueKey: uniquekey,
          timestamp: Date.now(),
          postImage: imageLink,
        };
        await reference.set(postObj);

        setTitle('');
        setVenue('');
        setFile('');
        setVideoId('');
        errorShow('success', ' successfully added in post');
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

  return (
    <Provider>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.back}>
          <Text style={{alignSelf: 'flex-start'}}>
            <AntIcon
              onPress={() => {
                navigation.navigate('Admin');
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
          Event Announcement
        </Text>

        <View
          style={{
            marginTop: verticalScale(25),
            marginHorizontal: moderateScale(10),
          }}>
          <TextInput
            label="Title :"
            placeholder="Please Enter Title"
            activeOutlineColor="#710193"
            value={title}
            style={{
              borderRadius: 18,
              fontSize: 13,
              marginVertical: verticalScale(5),
            }}
            mode="outlined"
            onChangeText={title => setTitle(title)}
          />
          <TextInput
            label="Venue :"
            placeholder="Please Enter Venue"
            activeOutlineColor="#710193"
            value={description}
            style={{
              borderRadius: 18,
              fontSize: 13,
              marginVertical: verticalScale(5),
            }}
            mode="outlined"
            onChangeText={venue => setVenue(venue)}
          />
        </View>

        <View
          style={{
            marginHorizontal: moderateScale(8),
            marginTop: scale(6),
            borderColor: '#710193',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {file != '' ? (
            <TouchableOpacity
              onPress={() => DeSelectImage()}
              style={{
                borderWidth: 1,
                backgroundColor: 'white',
                borderRadius: 6,
                borderColor: 'grey',
                width: 170,
                height: 120,
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
                width: 170,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
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

          {videoId != '' ? (
            <TouchableOpacity
              onPress={() => DeSelectVideo()}
              style={{
                borderWidth: 1,
                backgroundColor: 'white',
                borderRadius: 6,
                borderColor: 'grey',
                width: 170,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>
                <MaterialIcons name="deselect" color="#710193" size={28} />

                <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                      <TextInput
                        label="Video Id :"
                        placeholder="Please Enter Video Id"
                        activeOutlineColor="#710193"
                        value={videoId}
                        style={{
                          borderRadius: 18,
                          fontSize: 13,
                          marginVertical: verticalScale(5),
                        }}
                        mode="outlined"
                        onChangeText={videoId => setVideoId(videoId)}
                      />
                    </Dialog.Content>
                  </Dialog>
                </Portal>
              </Text>
              <Text style={{color: 'black'}}>Deselect Video ID</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => showDialog()}
              style={{
                borderWidth: 1,
                backgroundColor: 'white',
                borderRadius: 6,
                borderColor: 'grey',
                width: 170,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>
                <MaterialIcons name="add-a-photo" color="#710193" size={28} />

                <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                      <TextInput
                        label="Video Id :"
                        placeholder="Please Enter Video Id"
                        activeOutlineColor="#710193"
                        value={videoId}
                        style={{
                          borderRadius: 18,
                          fontSize: 13,
                          marginVertical: verticalScale(5),
                        }}
                        mode="outlined"
                        onChangeText={videoId => setVideoId(videoId)}
                      />
                    </Dialog.Content>
                  </Dialog>
                </Portal>
              </Text>
              <Text style={{color: 'black'}}>Select Video</Text>
            </TouchableOpacity>
          )}
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
              height: scale(42),
              justifyContent: 'center',
            }}
            mode="contained"
            onPress={() => createAnnouncement()}>
            Announce Event
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
              height: scale(42),
            }}
            mode="contained">
            Recent Event
          </Button>
        </View>

        {loader && <Loader />}
      </View>
    </Provider>
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

export default EventAnnouncement;
