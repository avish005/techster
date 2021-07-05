import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Keyboard, TextInput } from 'react-native';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useLayoutEffect, useState} from 'react'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {auth, db} from "../firebase";

import { Avatar } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase/app";

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState( [] );

    useLayoutEffect(() =>{
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style ={{
                    flexDirection: "row",
                    alignItems: "center",
                 }}>
                    <Avatar
                     rounded 
                     source = {{
                      uri: messages[0]?.data.photoURL,
                     }}
                     
                    />
                    <Text
                    style ={{ color: "white", marginLeft:10, fontWeight: "700" }}
                    >{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style ={{ marginLeft:10 }}
                    onPress={navigation.goBack}    
                >
                    <AntDesign name="arrowleft" size={24} color="white"/>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style ={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);
    
    const sendMessage = () => {
        Keyboard.dismiss(); {/* dismisses keyboard when msg is sent*/}
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName:auth.currentUser.displayName,
            email:auth.currentUser.email,
            photoURL:auth.currentUser.photoURL
        })
        setInput("") //clears input field after submit
    }

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => setMessages(
                snapshot.docs.map(doc =>({
                    id: doc.id,
                    data: doc.data()
                }))
            ));
            return unsubscribe;
     }, [route, messages]);


    return (
        <SafeAreaView style={{ flex:1, backgroundColor: 'white' }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : "height" }
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                {/*Dismisses keyboard when clicked anywhere on screen */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {/* React fragments */}
                    <>
                        <ScrollView contentContainerStyle = {{ paddingTop:15 }}>
                            {/*Rendering chats from firebase */} 
                            {messages.map(({id, data}) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                          rounded
                                          size={30}
                                          // web
                                          containerStyle={{
                                            position:"absolute",
                                            bottom:-15,
                                            right:-5,    
                                          }}
                                          position="absolute"
                                          bottom={-15}
                                          right={-5}
                                          source={{ 
                                            uri: data.photoURL,
                                        }} />
                                        <Text style = {styles.receiverText}>
                                            {data.message}
                                        </Text>
                                    </View>
                                ) :(
                                    <View key= {id} style={styles.sender}>
                                        <Avatar 
                                            rounded
                                            position = "absolute"
                                            size = {30}
                                            bottom = {-15}
                                            left = {-5}

                                            //web
                                            containerStyle = {{
                                                position: "absolute",
                                                bottom:-15,
                                                left:-5,
                                            }}
                                            source={{
                                                uri: data.photoURL,
                                            }}

                                        />
                                        <Text style = {styles.senderText}>
                                            {data.message}
                                        </Text>   
                                        <Text style = {styles.senderName}>
                                            {data.displayName}
                                        </Text> 
                                    </View>
                                )
                            ))}
                        </ScrollView>    
                        <View style = { styles.footer } >
                            <TextInput
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                onSubmitEditing = {sendMessage}
                                placeholder="Techster Message"
                                style ={styles.textInput}
                            />
                            <TouchableOpacity onPress = {sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>            
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    receiver: {
        padding:15,
        backgroundColor:"#ECECEC",
        alignSelf: "flex-end",
        borderRadius:20,
        marginRight: 15,
        marginBottom:20,
        maxWidth: "80%",
        position: "relative",
    },
    receiverText:{
        color: "black",
        fontWeight: "500",
        marginLeft: 10, 
        marginBottom: 15,
    },
    sender:{
        padding:15,
        backgroundColor:"#2B68E6",
        alignSelf: "flex-start",
        borderRadius:20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",
    },
    senderText:{
        color: "white",
        fontWeight: "500",
        marginLeft: 10, 
        marginBottom: 15,
    },
    senderName:{
        left: 10,
        paddingRight: 10,
        fontSize:10,
        color: "white",
    },
    footer: {
        flexDirection: 'row',
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor:"#ECECEC",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
});
