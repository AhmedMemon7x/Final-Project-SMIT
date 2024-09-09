import React, { useEffect, useState,useContext,useCallback } from 'react';
import { View, Text , FlatList,Image,TouchableOpacity,StyleSheet,ScrollView} from 'react-native';
import database from '@react-native-firebase/database';
import { Avatar,Searchbar , Card,Button, IconButton } from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../Components/AuthProvider';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from "react-native-toast-message"
import AntIcon from 'react-native-vector-icons/AntDesign';
import Loader from '../Components/Loader';

const UserAppliedJob = ({navigation}) => {
    const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState([]);
  const emailToSearch = "final@gmail.com"; 
   const {user}=useContext(AuthContext)
  const [currentUserEmail, setCurrentUserEmail] = useState([]);

  
  useEffect(() => {
    const fetchUserEmailData = async () => {
    const currentUser = auth().currentUser;
    try{
    setLoader(true);
if (currentUser) {
const userUID = currentUser.uid;
 const userRef =database().ref(`/users/${userUID}`);  
const snapshot= userRef.on('value', async snapshot => {
        if (snapshot.exists()) {
            setCurrentUserEmail(snapshot.val().userEmail)
          console.log(currentUserEmail)
        } else {
          console.log('No data available');
        }
      });
      
      return () => userRef.off('value',snapshot);
    }
  }catch(e){
console.log("errorrr")
  }
  finally{
    setLoader(false)
  }
};
    fetchUserEmailData();
  }, [user]);
  

  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserData = async () => {
        try {
          const reference = database().ref('UserAppliedForJobs');
          reference
            .orderByChild('email')
            .equalTo(currentUserEmail)
            .once('value')
            .then((snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                const userArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
                setUserData(userArray);
              } else {
                console.log('No matching records found');
              }
            });
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      };

      fetchUserData();
    }
  }, [currentUserEmail]);



  return (
    <ScrollView>

    <View>
    <TouchableOpacity style={styles.back} >
        <Text style={{alignSelf:"flex-start"}}>
          <AntIcon onPress={()=>{navigation.navigate("User Portal")}} name="arrowleft" size={20} color="white" />
        </Text>
        </TouchableOpacity>

      {userData.map((user, index) => (
        <View key={index} style={{borderBottomWidth:2,borderBottomColor:"gray",marginHorizontal:moderateScale(40),marginVertical:verticalScale(20)}}>
        <Card>
<Card.Cover source={{uri:`${user.jobImage}`}} />
</Card>

<View style={{position:"absolute",right:0,top:12}}>
</View>
<Text style={{color:"black",margin:scale(2),marginTop:scale(4),fontSize:16}}>Name: {user.title}</Text>
<Text style={{color:"black",margin:scale(2),fontSize:16}}>Email: {user.email}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>Job Title: {user.jobTitle}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>Job Branch: {user.jobBranch}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>Job Salary: {user.jobSalary}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>Experiance Required: {user.jobExperiance}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>Status: {user.status}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12}}>User Applied on: {user.userApplieddate}</Text>
<Text style={{color:"gray",margin:scale(2),fontSize:12, marginBottom:scale(15)}}>Job Posted on: {user.jobDate}</Text>


</View>


      ))}
    
    </View>
              {loader && <Loader/>}
      </ScrollView>
  );
};
const styles = StyleSheet.create({
    back:{
      
      alignSelf:'flex-start',
      justifyContent:"flex-start",
      backgroundColor: '#710193',
      padding: 3,
      borderRadius: 6,
      marginBottom:10,
        marginVertical: 10,
        marginHorizontal: 10,
    }
    
  });

export default UserAppliedJob;
