import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Loader from './Loader';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user), console.log('wali', user);
      setLoader(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser}}>
      {!loader && children}
    </AuthContext.Provider>
  );
};
