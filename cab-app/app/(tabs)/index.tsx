import { View, TextInput, Text, TouchableOpacity, Button } from "react-native";
import styles from "../Styles/style";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>();
  const [pickupLocation, setPickupLocation] = useState<any>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // const options = { accuracy: 6, distanceInterval: 0.5 };
      // Location.watchPositionAsync(options, (location) => {
      //   setLocation(location);
      // });
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const FindPickupLocation = (text: any) => {
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
          style={styles.input}
          placeholder="Enter Pickup Location"
          onChangeText={FindPickupLocation}
        />
      </View>
      <View style={{ borderTopWidth: 1 }}>
        {searchResult && !pickupLocation && (
          <View style={{ backgroundColor: "white" }}>
            {searchResult.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setPickupLocation(item);
                  }}
                >
                  <View key={index} style={styles.list}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>
                      {item.name}
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
      {pickupLocation && (
        <View style={styles.locationText}>
          <Text key={pickupLocation.fsq_id}>
            Pickup Location: {pickupLocation.name} | {pickupLocation.location.formatted_address}
          </Text>
          <View>
          <Button color={'#52b788'} onPress={() => setPickupLocation("")} title="Clear" />
          </View>
        </View>
      )}
      <View style={styles.button}>
      <Button color={'#52b788'}
        onPress={() => {
          router.push({
            pathname: "/Dropoff",
            params: {
              name: pickupLocation.name,
              address: pickupLocation.formatted_address,
              latitude: pickupLocation.geocodes.main.latitude,
              longitude: pickupLocation.geocodes.main.longitude,
            },
          });
        }}
        title="Select Dropoff"
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
            pinColor="#52b788"
            title={"Your Location"}
            description={"You are here"}
          />
        </MapView>
      )}
    </View>
  );
}
