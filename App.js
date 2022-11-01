import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import config from "./config.json";
import carImage from "./assets/images/car.png";

export default function App() {
  const [origin, setOrigin] = useState({
    latitude: 16.907405,
    longitude: -92.100216,
  });

  const [destination, setDestination] = useState({
    latitude: 16.920532,
    longitude: -92.1079,
  });

  const [status, setStatus] = useState({
    duration: "0 min.",
    distance: "0 km",
  });

  const getLocationPermission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }
    const location = await getCurrentPositionAsync({});

    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setDestination(currentLocation);
  };

  useEffect(() => {
    setInterval(() => {
      getLocationPermission();
    }, 10000);
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>Distsncia: {status.distance} km</Text>
        <Text>Duracion: {status.duration} min</Text>
      </View>
      <MapView
        initialRegion={{
          ...origin,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
        style={styles.map}
      >
        <Marker coordinate={origin} image={carImage} />
        <Marker
          draggable={true}
          onDragEnd={(direction) =>
            setDestination(direction.nativeEvent.coordinate)
          }
          coordinate={destination}
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={config.GOOGLE_MAPS_KEY}
          strokeColor="blue"
          strokeWidth={3}
          language="es"
          mode="DRIVING"
          onReady={(result) => {
            setStatus({ duration: result.duration, distance: result.distance });
          }}
          on
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: "60%",
  },
});
