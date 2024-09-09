import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import React from 'react';
import {useState} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';

function ImagePicker({navigation}) {
  var [file, setFile] = useState('');

  const openGallery = () => {
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
  return (
    <View>
      <View>
        {file != '' ? (
          <Image
            style={{width: 200, height: 200}}
            resizeMode="stretch"
            source={{uri: file}}
          />
        ) : null}
      </View>
      <Text>
        <Button onPress={() => openGallery()} title="Image Picker" />
      </Text>
    </View>
  );
}

export default ImagePicker;
