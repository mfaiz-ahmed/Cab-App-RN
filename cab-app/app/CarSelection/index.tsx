import React from "react";
import { Button, View, Text, Alert } from "react-native";
import styles from "../Styles/style";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { db } from "../Firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function index() {
  const [fare, setFare] = useState<any>();
  const [distance, setDistance] = useState<any>();
  const [vehicle, setVehicle] = useState<any>();

  const params = useLocalSearchParams();
  console.log("params", params);
  const {
    pickupName,
    pickupAddress,
    pickupLatitude,
    pickupLongitude,
    dropoffName,
    dropoffAddress,
    dropoffLatitude,
    dropoffLongitude,
  } = params;
  const rates: any = {
    bike: 30,
    rickshaw: 50,
    miniCar: 70,
    acCar: 100,
  };

  const calculateFare = (vehicle: any) => {
    const baseFare = rates[vehicle];
    const distance = calcCrow(
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude
    );
    const fare = baseFare * distance;
    console.log("fare", fare);
    setFare(Math.round(fare));
    setDistance(Math.round(distance));
    setVehicle(vehicle);
  };

  function calcCrow(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1: any = toRad(lat1);
    var lat2: any = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value: any) {
    return (Value * Math.PI) / 180;
  }

  const confirmCar = async () => {
    if (!vehicle) return;

    try {
      await addDoc(collection(db, "carSelections"), {
        pickupName: params.pickupName,
        pickupLatitude: params.pickupLatitude,
        pickupLongitude: params.pickupLongitude,
        dropoffName: params.dropoffName,
        dropoffLatitude: params.dropoffLatitude,
        dropoffLongitude: params.dropoffLongitude,
        distance: distance, // Store distance in kilometers
        carType: vehicle,
        fare,
        status: "pending",
      });

      // Navigate to confirmation or payment screen
      // router.push('/payment'); // Uncomment this to navigate after selection
      Alert.alert("Requesting...");
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <Text style={{ backgroundColor: "white" }}>
        Pickup Location : {pickupName} | {pickupAddress}
      </Text>
      <Text style={{ backgroundColor: "white" }}>
        Dropoff Location : {dropoffName} |{dropoffAddress}
      </Text>
      {distance && fare && (
        <View>
          <Text>Your overall distance traveled will be : {distance}</Text>
          <Text>You will be charged a total fare of : {fare}</Text>
        </View>
      )}
      <View style={{ padding: 1 }}>
        <Button
          onPress={() => {
            calculateFare("bike");
          }}
          title="Bike"
        />
        <Button
          onPress={() => {
            calculateFare("rickshaw");
          }}
          title="Rickshaw"
        />
        <Button
          onPress={() => {
            calculateFare("miniCar");
          }}
          title="Mini Car"
        />
        <Button
          onPress={() => {
            calculateFare("acCar");
          }}
          title="AC Car"
        />
        <Button onPress={confirmCar} title="Confirm Ride" />
      </View>
    </View>
  );
}
