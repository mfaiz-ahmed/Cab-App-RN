import { View, TextInput } from "react-native";
import styles from "../Styles/style";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function HomeScreen() {
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

  const FindPickupLocation = (text:any) => {

    const {latitude , longitude} = location.coords

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
      .then((response) => console.log('response' , response))
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 50 , backgroundColor: 'white'}}>
      <TextInput placeholder="Enter Pickup Location" onChangeText={FindPickupLocation} />
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
