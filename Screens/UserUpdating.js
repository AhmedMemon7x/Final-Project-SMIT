import React, {useState, useEffect } from 'react'
import { View, Text,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import { Button,TextInput, Dialog, Portal,Provider,Avatar, } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Loader from '../Components/Loader';
import Toast from "react-native-toast-message"
import AntIcon from 'react-native-vector-icons/AntDesign';

function UserUpdating ({navigation}) {
    const [updateName,setUpdateName]=useState("")
    const [updateProfile,setUpdateProfile]=useState("")
    const [loader, setLoader] = useState(false);
  
    const ImagePicker = () => {
      const options = {
          mediaType: 'photo',  // You can use 'photo' or 'video'
          quality: 0.8,       // Image quality (0 to 1)
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          errorShow("info","User cancelled the gallery.")    
          }
          else if (response.error) {
            errorShow("error",'Camera Error: ', response.error)    
      
          }
          else {
            setUpdateProfile(response.assets[0].uri)
          }
        })
      }
      const imageDownload=async ()=>{
        try{
        const reference = storage().ref('users/'+Date.now());
        await reference.putFile(updateProfile);
        const url = await reference.getDownloadURL();
        return url;
        }
        catch(error){
          errorShow("error",error)
        }
      }


      const user=auth().currentUser  
        const updateUserName = () => {
          setLoader(true)
    if (user !=="" || updateName!=="" || updateProfile!=="" ) {
      // Reference the user's path in the Realtime Database
      if(updateProfile!=="" && updateName !==""){

        
        const userRef = database().ref(`/users/${user.uid}`);
        
        // Update the user's name
        userRef.update({
          userName: updateName,
          userImageLink: updateProfile
        })
      .then(() => {
        errorShow("success",'Name and Profile updated successfully!')
        setUpdateName("")
        setUpdateProfile("")
        setLoader(false)
      })
      .catch(error => {
        errorShow("error",`Error: ${error.message}`)
        setLoader(false)
      });
    }
    else if(updateProfile=="" && updateName !==""){

      const userRef = database().ref(`/users/${user.uid}`);
        
      // Update the user's name
      userRef.update({
        userName: updateName,
      })
    .then(() => {
      errorShow("success",'Name updated successfully!')
      setUpdateName("")
      setLoader(false)
    })
    .catch(error => {
      errorShow("error",`Error: ${error.message}`)
      setLoader(false)
    });
    }
    else if(updateProfile!=="" && updateName ==""){
      const userRef = database().ref(`/users/${user.uid}`);
        
      // Update the user's name
      userRef.update({
        userImageLink: updateProfile
      })
    .then(() => {
      errorShow("success",`Profile updated successfully!`)
      setUpdateProfile("")
      setLoader(false)
    })
    .catch(error => {
      errorShow("error",`Error: ${error.message}`)
      setLoader(false)
    });
    }
    else{
      errorShow("error","Enter Data to Update")
      setLoader(false)
    }
    } else {
      errorShow("error","User not sign in")
      setLoader(false)
    }
  };
  const errorShow =(type,text)=>{
    Toast.show({
      type:type,
      text1:text,
    position:"bottom"
    })
  }
    
    
  return (
    <View style={{flex:1,position:"relative"}}>
              <TouchableOpacity style={styles.back} >
        <Text style={{alignSelf:"flex-start"}}>
          <AntIcon onPress={()=>{navigation.navigate("Admin Portal")}} name="arrowleft" size={20} color="white" />
        </Text>
        </TouchableOpacity>
  

      <View style={{marginTop:scale(50)}} >
      <Text style={{justifyContent:"center",alignSelf:"center",marginVertical:verticalScale(40)}}>

      {updateProfile!="" ?
                <TouchableOpacity>
                <Avatar.Image size={100} source={{uri:updateProfile}}  />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={()=>ImagePicker()}>
                <Avatar.Image size={100} style={{backgroundColor:"white"}}  source={{uri:"https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-6/128/profile-male-circle2-512.png"}}  />         
                </TouchableOpacity>
                }
                </Text>
      </View>
<View>
<TextInput
label="Update Name :"
placeholder="Enter your name"
activeOutlineColor='#710193'
value={updateName}
style={{borderRadius:18,fontSize:13,marginVertical:verticalScale(5),marginHorizontal:moderateScale(10)  
,fontSize:12}}
mode='outlined'
onChangeText={updateName => setUpdateName(updateName)}
/>
</View>
    <View style={{flex:1}}>

  <Button
    style={{ marginHorizontal:moderateScale(10),height:scale(42),justifyContent:"center",backgroundColor:'#710193',marginVertical:verticalScale(50)}}
    mode="contained"
      onPress={()=>updateUserName()}
    >
Update Profile
    </Button>
        </View>
        {loader && <Loader/>}
    </View>
  )
}

const styles = StyleSheet.create({
  back:{
    
    alignSelf:'flex-start',
    justifyContent:"flex-start",
    backgroundColor: '#710193',
    padding: 3,
    borderRadius: 6,
      marginVertical: 20,
      marginHorizontal: 10,
  }
  
});


export default UserUpdating