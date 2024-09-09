import React, { useState, useCallback, useRef, useEffect } from "react";
import { Text,View, Alert, ScrollView, TextInput, Button} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
export default function YoutubeVideo({navigation}) {
  const [playing, setPlaying] = useState(false);
    const [videoList,setVideoList]=useState([])
    const [inp,setInp]=useState("")
    useEffect(()=>{
        setVideoList([
            {
        "videoId":"YZ92244oWEU"
            },
        
          ])
    },[])
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
const addNewLink=()=>{
    var list =[...videoList,{
        "videoId":inp,
    }]
setVideoList(list)
console.log(list)
}
  return (
    <View>
        <ScrollView>
            <TextInput placeholder="Enter youtube video Id" style={{margin:10,borderColor:"black",borderWidth:2,color:"black",marginBottom:10,}}  value={inp}
            onChangeText={(e)=>setInp(e)}/>
        <Button style={{margin:10}} onPress={()=>addNewLink()} title="Add New Link"/>
        {
            videoList.map((v,i)=>{
                return(
                    <>

<YoutubePlayer
  height={250}
  play={playing}
  key={i}
  videoId={v.videoId}
  onChangeState={onStateChange}
/>

                    </>
                )
            })
        }
</ScrollView>
    </View>
  );
}