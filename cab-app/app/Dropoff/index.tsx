import React from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
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
  const [searchResult, setSearchResult] = useState<any>();
  const [dropoffLocation, setDropoffLocation] = useState<any>();
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

  const FindDropoffLocation = (text: any) => {
    const { latitude, longitude } = location.coords;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3i5gncoRU6bMsLjf+YKvmGRcD8nnWjTWY55zhTFMM+FU=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${text}&ll=${latitude},${longitude}&radius=100000`,
      options
    )
      .then((response) => response.json())
      .then((response) => setSearchResult(response.results))
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "white" }}>
        <TextInput
          onChangeText={FindDropoffLocation}
          placeholder="Enter Pickup Location"
        />
        {searchResult && !dropoffLocation && (
          <View style={{ backgroundColor: "white" }}>
            {searchResult.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setDropoffLocation(item);
                  }}
                >
                  <View key={index} style={{ borderWidth: 1, padding: 2 }}>
                    <Text>{item.name}</Text>
                    <Text>{item.location.formatted_address}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
      {params && (
        <View
          style={{ padding: 2, backgroundColor: "white", borderTopWidth: 1 }}
        >
          <Text>Pickup Location : {params.name}</Text>
        </View>
      )}
      {dropoffLocation && (
        <View style={{ backgroundColor: "white" }}>
          <Text key={dropoffLocation.fsq_id}>
            Dropoff Location: {dropoffLocation.name} |{" "}
            {dropoffLocation.location.formatted_address}
          </Text>
          <TouchableOpacity onPress={() => setDropoffLocation("")}>
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      )}
      <Button onPress={()=>{
        router.push({pathname : '/CarSelection' , params:{
          pickupName : params.name,
          pickupAddress : params.address,
          pickupLatitude : params.latitude,
          pickupLongitude : params.longitude,
          dropoffName : dropoffLocation.name,
          dropoffAddress : dropoffLocation.location.formatted_address,
          dropoffLatitude : dropoffLocation.geocodes.main.latitude,
          dropoffLongitude : dropoffLocation.geocodes.main.longitude,
        }})
      }} title="Select Car" />
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
