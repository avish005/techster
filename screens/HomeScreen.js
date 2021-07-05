import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "./../firebase";

import { Avatar } from "react-native-elements";
import CustomListItem from "../Components/CustomListItem";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };
  useEffect(() =>{
    const unsubscribe = db.collection('chats').onSnapshot((snapshot) => (
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
      })))
    ));
    return unsubscribe;
  },[]);
 
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Techster",
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
      headerLeft: () => {
        return (
          <View style={{ marginLeft: 20 }}>
            <TouchableOpacity>
              <Avatar
                rounded
                source={{
                  uri: auth?.currentUser?.photoURL,
                }}
              />
            </TouchableOpacity>
          </View>
        );
      },
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 80,
              marginRight: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('AddChat')} activeOpacity={0.5} >
              <SimpleLineIcons name="pencil" color="black" size={20} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={signOut}>
              <SimpleLineIcons name="logout" color="black" size={20} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);

  const enterChat = (id, chatName) =>{
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({id, data: { chatName }}) => (
        <CustomListItem 
          key={id}
          id={id}
          chatName={ chatName }
          enterChat = { enterChat } 
         />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    height: "100%",
  }
});
