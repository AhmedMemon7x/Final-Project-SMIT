import React, {useEffect, useState} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Searchbar, Card, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Loader from '../Components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import SearchFilter from '../Components/SearchFilter';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const UsersList = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState(null);

  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
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

      <Searchbar
        style={{
          marginHorizontal: moderateScale(10),
          backgroundColor: 'white',
          marginVertical: verticalScale(10),
        }}
        icon={() => <AntIcon name="search1" size={18} color="black" />}
        placeholder="Search"
        onChangeText={search => setSearch(search)}
      />
      <SearchFilter data={users} input={search} setInput={setSearch} />
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

export default UsersList;
