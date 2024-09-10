import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../Styles/style";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

export default function index() {
  const params = useLocalSearchParams();
  console.log("params", params);
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "white" }}>
        <TextInput placeholder="Enter Pickup Location" />
      </View>
      {params && (
        <View style={{ padding: 2 }}>
          <Text>Pickup Location : {params.name}</Text>
        </View>
      )}
      {location && (
        <MapView
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0012,
            longitudeDelta: 0.0002,
          }}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Your Location"}
            description={"You are here"}
          />
        </MapView>
      )}
    </View>
  );
}
