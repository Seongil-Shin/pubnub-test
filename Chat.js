import { usePubNub } from "pubnub-react";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Input, ListItem } from "react-native-elements";

function Chat({ uuid }) {
   const pubnub = usePubNub();
   const [channels] = useState(["awesome-channel"]);
   const [messages, addMessage] = useState([]);
   const [message, setMessage] = useState("");

   useEffect(() => {
      const pubnubListeners = {
         message: handleMessage,
      };
      pubnub.addListener(pubnubListeners);
      pubnub.subscribe({ channels });
      return () => {
         pubnub.removeListener(pubnubListeners);
         pubnub.unsubscribeAll();
      };
   }, [pubnub, channels]);

   const handleMessage = (event) => {
      const message = event.message;
      if (typeof message === "string" || message.hasOwnProperty("text")) {
         const text = message.text || message;
         if (event.publisher === uuid) {
            addMessage((messages) => [...messages, { text: text, type: "me" }]);
         } else {
            addMessage((messages) => [
               ...messages,
               { text: text, type: "other" },
            ]);
         }
      }
   };
   const sendMessage = (message) => {
      if (message) {
         pubnub
            .publish({ channel: channels[0], message })
            .then(() => setMessage(""));
      }
   };

   const onChange = (v) => {
      setMessage(v);
   };

   return (
      <View style={styles.container}>
         <View style={styles.chatBox}>
            <ScrollView>
               {messages.map((item, idx) => {
                  return (
                     <ListItem key={idx}>
                        <ListItem.Content
                           style={stylesFunc({ type: item.type }).chat}>
                           <ListItem.Title
                              style={stylesFunc({ type: item.type }).content}>
                              {item.text}
                           </ListItem.Title>
                        </ListItem.Content>
                     </ListItem>
                  );
               })}
            </ScrollView>
         </View>
         <View style={styles.inputBox}>
            <Input
               value={message}
               onChangeText={onChange}
               containerStyle={{ width: "85%" }}
            />
            <Button
               title="send"
               type="clear"
               onPress={() => sendMessage(message)}
               containerStyle={{ width: "13%" }}
            />
         </View>
      </View>
   );
}

const stylesFunc = ({ type }) =>
   StyleSheet.create({
      chat: {
         flexDirection: "row",
         justifyContent: type === "me" ? "flex-end" : "flex-start",
      },
      content: {
         padding: 10,
         borderWidth: 1,
         borderRadius: 20,
         borderColor: "rgba(0,0,0,0.5)",
      },
   });

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   chatBox: {
      padding: 20,
      flex: 9,
   },
   inputBox: {
      flex: 1,
      flexDirection: "row",
   },
});

export default Chat;
