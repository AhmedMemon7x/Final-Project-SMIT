import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AuthProvider, AuthContext} from '../Components/AuthProvider';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SignUp from '../Screens/signUp';
import Login from '../Screens/Login';
import CustomDrawer from '../Components/Drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useContext, useState, useEffect} from 'react';
import PreSignup from '../Screens/PreSignup';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import GetAllUser from '../Screens/GetAllUser';
import PostAnnouncement from '../Screens/PostAnnouncement';
import DeleteAnnouncemt from '../Screens/DeleteAnnouncemt';
import UserUpdating from '../Screens/UserUpdating';
import AddJobs from '../Screens/AddJobs';
import GetJob from '../Screens/GetJob';
import ViewAllJob from '../Screens/ViewAllJob';
import ViewUserAppliedJob from '../Screens/ViewUserAppliedJob';
import AppliedJob from '../Screens/AppliedJob';
import JoinEvent from '../Screens/JoinEvent';
import AdminEventShow from '../Screens/AdminEventShow';
import AdminJobShow from '../Screens/AdminJobShow';
import UserEventShow from '../Screens/UserEventShow';
import UserJobShow from '../Screens/UserJobShow';
import UserAppliedJob from '../Screens/UserAppliedJob';
import AdminUpdatingProfile from '../Screens/AdminUpdatingProfile';

function Navigation() {
  const Stack = createNativeStackNavigator();
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;

      try {
        if (currentUser) {
          setRole(currentUser.email);

          const userUID = currentUser.uid;
          const userRef = database().ref(`/users/${userUID}`);
          const snapshot = await userRef.once('value', snapshot => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
              if (userData) {
                console.log(userData.userEmail, 'ADmin drawer');
              }
            } else {
              console.log('No data available');
            }
          });

          return () => userRef.off('value', snapshot);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserData();
  }, [user]);

  console.log(role, 'done,ree');

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          role === 'admin@gmail.com' ? (
            <Stack.Screen
              name="AdminDrawer"
              options={{headerShown: false}}
              component={AdmindrawerTab}
            />
          ) : (
            <Stack.Screen
              name="bottomtab"
              options={{headerShown: false}}
              component={DrawerTab}
            />
          )
        ) : (
          <>
            <Stack.Screen
              name="PreSignup"
              options={{headerShown: false}}
              component={PreSignup}
            />
            <Stack.Screen
              name="PreLogin"
              options={{headerShown: false}}
              component={Login}
            />
            <Stack.Screen
              name="PreUserSignup"
              options={{headerShown: false}}
              component={SignUp}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// function UpperTab(){
//     const UpperTab=createMaterialTopTabNavigator()
//     return(
//         <UpperTab.Navigator
//         screenOptions={({ route }) => ({
//             tabBarActiveTintColor: 'black',
//             tabBarInactiveTintColor: 'black',
//             tabBarIcon: ({ focused, color, size }) => {
//               let OnIcon;

//               if (route.name === 'Home') {
//                 OnIcon = focused
//                   ? 'home'
//                   : 'home-outline';
//               } else if (route.name === 'Contact') {
//                 OnIcon = focused ? 'settings' : 'settings-outline';
//               }

//               // You can return any component that you like here!
//               return <Ionicon  name={OnIcon}  color={"yellow"} size={25} />;
//             //   return <OnIcon  name={OnIcon} size={size} color={color} />;
//             },
//           })}
//         >
//             <UpperTab.Screen  options={{headerShown:false}} name="Home" component={Home}/>
//             <UpperTab.Screen options={{headerShown:false}} name="Contact" component={Contact}/>
//             <UpperTab.Screen  options={{headerShown:false}} name="Drawer" component={Drawer}/>
//         </UpperTab.Navigator>
//     )
// }

function Tab() {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarIcon: ({focused, color, size}) => {
          let OnIcon;

          if (route.name === 'Events') {
            OnIcon = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Jobs') {
            OnIcon = focused ? 'git-network' : 'git-network-outline';
          } else if (route.name === 'Applied Job') {
            OnIcon = focused ? 'document-text-sharp' : 'document-text-outline';
          }
          return <Ionicon name={OnIcon} color={'purple'} size={25} />;
        },
      })}>
      <BottomTab.Screen
        options={{headerShown: false}}
        name="Events"
        component={JoinEvent}
      />
      <BottomTab.Screen
        options={{headerShown: false}}
        name="Jobs"
        component={GetJob}
      />
      <BottomTab.Screen
        options={{headerShown: false}}
        name="Applied Job"
        component={AppliedJob}
      />
    </BottomTab.Navigator>
  );
}
function AdminTab() {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarIcon: ({focused, color, size}) => {
          let OnIcon;

          if (route.name === 'Events') {
            OnIcon = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Jobs') {
            OnIcon = focused ? 'git-network' : 'git-network-outline';
          } else if (route.name === 'User CV') {
            OnIcon = focused ? 'document-text-sharp' : 'document-text-outline';
          }
          return <Ionicon name={OnIcon} color={'purple'} size={25} />;
        },
      })}>
      <BottomTab.Screen
        options={{headerShown: false}}
        name="Events"
        component={AdminEventShow}
      />
      <BottomTab.Screen
        options={{headerShown: false}}
        name="Jobs"
        component={AdminJobShow}
      />
      <BottomTab.Screen
        options={{headerShown: false}}
        name="User CV"
        component={ViewUserAppliedJob}
      />
    </BottomTab.Navigator>
  );
}

function DrawerTab() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="User Portal"
        component={Tab}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Events"
        component={UserEventShow}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="bookmark-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Jobs"
        component={UserJobShow}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="git-network-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Applied Jobs"
        component={UserAppliedJob}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="document-text-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Update Profile"
        component={AdminUpdatingProfile}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="timer-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
function AdmindrawerTab() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Admin Portal"
        component={AdminTab}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Registered Users"
        component={GetAllUser}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Event Announcement"
        component={PostAnnouncement}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Jobs Announcement"
        component={AddJobs}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="git-network-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Update Profile"
        component={UserUpdating}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="timer-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Delete Announcements"
        component={DeleteAnnouncemt}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="trash-bin-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Delete Jobs"
        component={ViewAllJob}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="trash-bin-outline" size={22} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default Navigation;
