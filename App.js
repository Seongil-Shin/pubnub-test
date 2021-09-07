import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import uuid from "react-uuid";
import { REACT_APP_PUBLISH_KEY, REACT_APP_SUBSCRIBE_KEY } from "@env";
import Chat from "./Chat";

const myUuid = uuid();

const pubnub = new PubNub({
   publishKey: REACT_APP_PUBLISH_KEY,
   subscribeKey: REACT_APP_SUBSCRIBE_KEY,
   uuid: myUuid,
});

export default function App() {
   console.log(REACT_APP_PUBLISH_KEY);
   return (
      <SafeAreaProvider style={styles.container}>
         <PubNubProvider client={pubnub}>
            <View style={styles.container}>
               <StatusBar style="auto" />
               <Chat uuid={myUuid} />
            </View>
         </PubNubProvider>
      </SafeAreaProvider>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
});
