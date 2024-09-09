import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Loader from '../Components/Loader';
import {Avatar, Searchbar, Card, IconButton} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';

const SearchFilter = ({input, setInput}) => {
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = database().ref('/eventJoined');

    usersRef
      .once('value')
      .then(snapshot => {
        const usersData = snapshot.val();
        const usersList = Object.keys(usersData)
          .map(key => ({
            id: key,
            ...usersData[key],
          }))
          .filter(user => user.userEmail !== 'admin@gmail.com');
        setUsers(usersList);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const errorShow = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: 'bottom',
    });
  };
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <FlatList
        data={users}
        renderItem={({item}) => {
          if (input === null) {
            return (
              <>
                <Card.Title
                  style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 2,
                    margin: 10,
                    borderRadius: 10,
                  }}
                  title={item.eventTitle}
                  subtitle={item.userEmail}
                />
              </>
            );
          }

          if (item.eventTitle.toLowerCase().includes(input.toLowerCase())) {
            return (
              <Card.Title
                style={{
                  borderBottomColor: 'gray',
                  borderBottomWidth: 2,
                  margin: 10,
                  borderRadius: 10,
                }}
                title={item.eventTitle}
                subtitle={item.userEmail}
              />
            );
          }
        }}
      />
      {loader && <Loader />}
    </View>
  );
};

export default SearchFilter;
