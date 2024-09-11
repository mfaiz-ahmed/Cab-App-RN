import React from "react";
import { Button, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "../Styles/style";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

export default function index() {
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

  return (
    <View style={{ backgroundColor: "white" }}>
      <Text style={{ backgroundColor: "white" }}>
        Pickup Location : {pickupName} | {pickupAddress}
      </Text>
      <Text style={{ backgroundColor: "white" }}>
        Dropoff Location : {dropoffName} |{dropoffAddress}
      </Text>
      <View style={{ margin: 1 }}>
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
      </View>
    </View>
  );
}
