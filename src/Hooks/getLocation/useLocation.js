import { useState, useEffect, useMemo } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

const useLocation = () => {
 const [currentLocation, setLocation] = useState(null);
 const [error, setError] = useState(null);
 const [isFetching, setIsFetching] = useState(false);

 useEffect(() => {
  checkLocationServices();
 }, []);

 const checkLocationServices = async () => {
  if (Platform.OS === 'ios') {
   const authorization =  Geolocation.requestAuthorization('whenInUse');
   if (authorization === 'denied' || authorization === 'restricted') {
    setError('Location permission denied');
    Alert.alert('Location Permission', 'Please enable location services');
    return false;
   }
  } else if (Platform.OS === 'android') {
   const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
     title: 'Location Permission',
     message: 'This app needs access to your location',
     buttonNeutral: 'Ask Me Later',
     buttonNegative: 'Cancel',
     buttonPositive: 'OK',
    }
   );
   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    setError('Location permission denied');
    Alert.alert('Location Permission', 'Please enable location services');
    return false;
   }
  }
  return true;
 };

 const getLocation = async () => {
  if (isFetching) return;

  const hasPermission = await checkLocationServices();
  if (!hasPermission) {
   return;
  }

  setIsFetching(true);

  Geolocation.getCurrentPosition(
   position => {
    setLocation(prevLocation => {
     // Check if the new location is different from the previous location
     if (
      prevLocation &&
      prevLocation.latitude === position.coords.latitude &&
      prevLocation.longitude === position.coords.longitude
     ) {
      return prevLocation; // If the location hasn't changed, return the previous location
     }
     return position.coords;
    });
    setIsFetching(false);
   },
   error => {
    setError(error);
    setIsFetching(false);
   },
   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
 };

 const memoizedLocation = useMemo(() => currentLocation, [currentLocation]);

 return { currentLocation: memoizedLocation, error, getLocation };
};

export default useLocation;
