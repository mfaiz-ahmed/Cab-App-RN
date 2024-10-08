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
      <View style={{ backgroundColor: "white", marginTop: -30 }}>
        <TextInput
          style={styles.input}
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
                  <View key={index} style={styles.list}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>
                      {item.name}{" "}
                    </Text>
                    <Text style={{ fontSize: 18 }}>
                      {item.location.formatted_address}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
      {params && (
        <View style={{ backgroundColor: "white" }}>
          <Text
            style={{
              fontSize: 18,
              padding: 4,
            }}
          >
            Pickup Location : {params.name} | {params.address}
          </Text>
        </View>
      )}
      {dropoffLocation && (
        <View style={styles.locationText}>
          <Text
            style={{
              fontSize: 18,
              padding: 4,
            }}
            key={dropoffLocation.fsq_id}
          >
            Dropoff Location: {dropoffLocation.name} |{" "}
            {dropoffLocation.location.formatted_address}
          </Text>
          <View>
          <Button
            color={"#52b788"}
            onPress={() => setDropoffLocation("")}
            title="clear"
            />
            </View>
        </View>
      )}
      <View style={styles.button}>
        <Button
          color={"#52b788"}
          onPress={() => {
            router.push({
              pathname: "/CarSelection",
              params: {
                pickupName: params.name,
                pickupAddress: params.address,
                pickupLatitude: params.latitude,
                pickupLongitude: params.longitude,
                dropoffName: dropoffLocation.name,
                dropoffAddress: dropoffLocation.location.formatted_address,
                dropoffLatitude: dropoffLocation.geocodes.main.latitude,
                dropoffLongitude: dropoffLocation.geocodes.main.longitude,
              },
            });
          }}
          title="Select Car"
        />
      </View>
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
