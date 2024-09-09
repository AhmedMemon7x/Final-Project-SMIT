import { View, Text } from 'react-native'
import React from 'react'
import Navigation from './Config/Navigation'
import 'react-native-gesture-handler'
import Toast from "react-native-toast-message"
import { AuthProvider } from './Components/AuthProvider'

const App = () => {
  return (
    <View style={{flex:1}}>
      <AuthProvider>

<Navigation/>
<Toast/>
      </AuthProvider>
    </View>
  )
}

export default App